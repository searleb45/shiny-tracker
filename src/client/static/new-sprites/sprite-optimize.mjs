import imagemin from 'imagemin';
import gifsicle from '@mechanikadesign/imagemin-gifsicle';

imagemin(['./*.gif'], {
	destination: '../sprites',
	plugins: [
		gifsicle({
			interlaced: true,
			optimizationLevel: 3,
			resize: '75x_',
		})
	]
}).then(() => {
	console.log('compression completed');
})