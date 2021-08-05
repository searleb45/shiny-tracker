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

const SYNC_EVENT_NAME = 'ShinyTracker:backgroundPutSync';
let isSyncing = false;
let requestAddedDuringSync = false;

const createDB = () => {
	openDB(PUT_DB_NAME, PUT_DB_VERSION, {
		upgrade: (db) => {
			db.createObjectStore(PUT_OBJECT_STORE, { keyPath: 'id' });
		}
	});
};

const assetFromNetwork = async (request, timeout) => {
	const timeoutId = setTimeout(() => {throw new Error('request timeout')}, timeout);
	try {
		const res = await fetch(request.clone());
		clearTimeout(timeoutId);
		if(res.status === 200 && request.method === 'GET') {
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
		assetFromNetwork(event.request, 5000).then(async (res) => {
			if(res.status === 200) {
				updateCachedGetResponse(await res.clone().json(), true);
			}
			return res;
		})
	);
}

function handleUpdateActiveHunts(event) {
	event.respondWith(
		assetFromNetwork(event.request, 2000)
			.then(async (res) => {
				if(res.status === 200) {
					const response = res.clone();
					const newHunt = await response.json();
					// Update the cache for the GET response in case we go offline
					await updateCachedGetResponse(newHunt, true);
				}
				return res;
			})
			.catch(async (err) => {
				console.log('update catch method', err);
				try {
					// Register sync request for when we come back online
					await self.registration.sync.register(SYNC_EVENT_NAME);
					const requestBody = await event.request.json();
					// Cache the new value in IndexedDB for sync later
					const db = await openDB(PUT_DB_NAME, PUT_DB_VERSION);
					await db.put(PUT_OBJECT_STORE, requestBody);
					if(isSyncing) requestAddedDuringSync = true;
					// Also update the cache for the GET response in case of refresh
					const putResponse = await updateCachedGetResponse(requestBody, false);
					if(putResponse) {
						return new Response(JSON.stringify(putResponse));
					}
				} catch (err) {
					console.error('Background sync registration failed', err);
				}
			})
	);
}

async function updateCachedGetResponse(newHunt, isFullHuntObj) {
	// Update the cache for the GET response in case we go offline
	let putResponse = null;
	const getCache = await caches.open(GET_CACHE_NAME);
	const keys = await getCache.keys();
	const cachedResponse = await getCache.match(keys[0]);
	const responseBody = await cachedResponse.clone().json();
	const huntIndex = responseBody.findIndex(hunt => hunt.id === newHunt.id);
	if(isFullHuntObj) {
		if(huntIndex >= 0) {
			responseBody[huntIndex] = newHunt;
			putResponse = newHunt;
		} else {
			responseBody.push(newHunt);
		}
	} else {
		if(huntIndex >= 0) {
			const hunt = responseBody[huntIndex];
			hunt.encounters = newHunt.val;
			putResponse = hunt;
			if(newHunt.op === 'complete') {
				hunt.completed = true;
				responseBody.splice(huntIndex, 1);
			}
		}
	}
	await getCache.put(keys[0], new Response(JSON.stringify(responseBody)));
	return putResponse;
}

async function cacheGetResponseIfNotLoaded() {
	const getCache = await caches.open(GET_CACHE_NAME);
	const keys = await getCache.keys();
	if(keys.length === 0) {
		await getCache.add('/api/active-hunts');
	}
}

self.addEventListener('fetch', (event) => {
	const url = event.request.url;
	if(url.match(/\/api\/active-hunts/)) {
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
	clients.claim();
	cacheGetResponseIfNotLoaded();
	event.waitUntil(createDB());
});

// Register sync event to dispatch update sync to API
if('sync' in self.registration) {
	self.addEventListener('sync', (event) => {
		if(event.tag === SYNC_EVENT_NAME) {
			const syncComplete = async () => {
				isSyncing = true;
	
				let syncError;
				try {
					await replayRequests();
				} catch (error) {
					if(error instanceof Error) {
						syncError = error;
	
						throw syncError;
					}
				} finally {
					if(requestAddedDuringSync && !(syncError && !event.lastChance)) {
						await self.registration.sync.register(SYNC_EVENT_NAME);
					}
				}
			};
			event.waitUntil(syncComplete());
		}
	})
} else {
	console.log('background sync not supported, replaying requests on every SW wake');

	replayRequests();
}

async function replayRequests() {
	// Fetch requests from IDB and replay them one at a time
	const db = await openDB(PUT_DB_NAME, PUT_DB_VERSION);
	let cursor = await db.transaction(PUT_OBJECT_STORE, 'readwrite').store.openCursor();

	while(cursor) {
		const reqBody = {...cursor.value};
		fetch('/api/active-hunts', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json;charset=UTF-8'
			},
			body: JSON.stringify(reqBody)
		})
		.then(res => {
			if(res.ok) {
				db.delete(PUT_OBJECT_STORE, reqBody.id);
			}
		}).catch(err => {
			console.error('Sync fetch failed with error', err);
		});
		cursor = await cursor.continue();
	}
}
