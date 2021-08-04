import { NavigationRoute, registerRoute } from 'workbox-routing';
import {CacheFirst} from 'workbox-strategies';
import {precacheAndRoute, createHandlerBoundToURL} from 'workbox-precaching';
import {openDB} from 'idb';

self.skipWaiting();
precacheAndRoute($WEBPACK_GENERATED_MANIFEST);

registerRoute(new NavigationRoute(createHandlerBoundToURL("index.html"), {
	denylist: [/\/twitchAuth(\/.*)?/]
}));
registerRoute(/\/(boxart|sprites)\/.*/, new CacheFirst(), 'GET');
registerRoute(/\.(css|js)/, new CacheFirst(), 'GET');

const GET_CACHE_NAME = 'API_GET_CACHE';
const PUT_DB_NAME = 'API_PUT_DB';
const PUT_DB_VERSION = 1;
const PUT_OBJECT_STORE = 'huntsToUpdate';

const createDB = () => {
	openDB(PUT_DB_NAME, PUT_DB_VERSION, {
		upgrade: (db) => {
			db.createObjectStore(PUT_OBJECT_STORE, { keyPath: 'id' })
		}
	});
};

const assetFromNetwork = async (request, timeout) => {
	const timeoutId = setTimeout(() => {throw new Error('request timeout')}, timeout);
	try {
		const res = await fetch(request.clone());
		clearTimeout(timeoutId);
		if(request.method === 'GET') {
			updateCache(request, res.clone());
		}
		return res;
	} catch (err) {
		clearTimeout(timeoutId);
		throw new Error(err);
	}
};

const assetFromCache = async (request) => {
	const cache = await caches.open(GET_CACHE_NAME);
	const cacheHit = await cache.match(request);
	return cacheHit;
};

const updateCache = async (request, response) => {
	const cache = await caches.open(GET_CACHE_NAME);
	cache.put(request, response);
};

function handleGetActiveHunts(event) {
	event.respondWith(
		assetFromNetwork(event.request, 10000).catch(() => {
			return assetFromCache(event.request);
		})
	);
}

function handlePostActiveHunt(event) {
	event.respondWith(
		assetFromNetwork(event.request, 10000).then(async (res) => {
			updateCachedGetResponse(await res.clone().json(), true);
			return res;
		})
	);
}

function handleUpdateActiveHunts(event) {
	event.respondWith(
		assetFromNetwork(event.request, 10000)
			.then(async (res) => {
				const response = res.clone();
				const newHunt = await response.json();
				// Update the cache for the GET response in case we go offline
				await updateCachedGetResponse(newHunt, true);
				return res;
			})
			.catch(async () => {
				const requestBody = await event.request.json();
				// We're just gonna let React handle the failure of this request
				// Gotta cache the new value in IndexedDB for sync later though
				const db = await openDB(PUT_DB_NAME, PUT_DB_VERSION);
				await db.put(PUT_OBJECT_STORE, requestBody);
				// TODO Register sync request for when we come back online

				// Also update the cache for the GET response in case of refresh
				const putResponse = await updateCachedGetResponse(requestBody, false);
				if(putResponse) {
					return new Response(JSON.stringify(putResponse));
				}
			})
	);
}

async function updateCachedGetResponse(newHunt, isFullHuntObj) {
	// Update the cache for the GET response in case we go offline
	const getCache = await caches.open(GET_CACHE_NAME);
	const keys = await getCache.keys();
	const cachedResponse = await getCache.match(keys[0]);
	const responseBody = await cachedResponse.clone().json();
	const huntIndex = responseBody.findIndex(hunt => hunt.id === newHunt.id);
	if(isFullHuntObj) {
		if(huntIndex >= 0) {
			responseBody[huntIndex] = newHunt;
		} else {
			responseBody.push(newHunt);
		}
	} else {
		if(huntIndex >= 0) {
			const hunt = responseBody[huntIndex];
			hunt.encounters = newHunt.val;
			if(newHunt.op === 'complete') {
				hunt.completed = true;
				responseBody.splice(huntIndex, 1);
			}
		}
	}
	await getCache.put(keys[0], new Response(JSON.stringify(responseBody)));
	return huntIndex >= 0 ? responseBody[huntIndex] : null;
}

self.addEventListener('fetch', (event) => {
	const url = event.request.url;
	if(url.match(/\/api\/.*/)) {
		if(event.request.method === 'GET') {
			handleGetActiveHunts(event);
		} else if(event.request.method === 'PUT') {
			handleUpdateActiveHunts(event);
		} else if(event.request.method === 'POST') {
			handlePostActiveHunt(event);
		}
	}
});

self.addEventListener('activate', (event) => {
	event.waitUntil(createDB());
});

// TODO Register sync event to dispatch update sync to API
