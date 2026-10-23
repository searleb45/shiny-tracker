import imagemin from 'imagemin';
import gifsicle from '@mechanikadesign/imagemin-gifsicle';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

(async () => {
	await imagemin(['./*.gif'], {
		destination: '../sprites',
		plugins: [
			gifsicle({
				interlaced: true,
				optimizationLevel: 3,
				resize: '75x_',
			})
		]
	});

	const webpFiles = (await readdir('.')).filter((file) => file.endsWith('.webp'));
	for (let index = 0; index < webpFiles.length; index += 4) {
		await Promise.all(webpFiles.slice(index, index + 4).map(async (file) => {
			const inputPath = path.join('.', file);
			const outputPath = path.join('../sprites', file);
			const metadata = await sharp(inputPath, { animated: true }).metadata();
			const animation = metadata.pages > 1
				? { loop: metadata.loop, delay: metadata.delay }
				: {};

			await sharp(inputPath, { animated: true })
				.resize({ width: 150 })
				.webp({ quality: 100, ...animation })
				.toFile(outputPath);
		}));
	}

	console.log('compression completed');
})();