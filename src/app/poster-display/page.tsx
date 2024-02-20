'use client';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ImageDataAtom } from '../store/imagestore';

const PosterDisplay = () => {
	const router = useRouter();
	const [imageAtom] = useAtom(ImageDataAtom);

	//const imageUrl = encodeURIComponent(router.query.image as string);

	const handleRetry = () => {
		router.push('/'); // Adjust the path as per your form page's route
	};

	return (
		<div className='container mx-auto p-4 mt-10'>
			<h2 className='text-2xl font-bold text-center mb-4'>
				Generated Poster
			</h2>
			{imageAtom && (
				<img
					src={`data:image/png;base64, ${imageAtom}`}
					alt='Generated Poster'
					className='block mx-auto'
				/>
			)}
			<div className='flex justify-center space-x-4 mt-4'>
				<a
					//@ts-ignore
					href={`data:image/png;base64, ${imageAtom}`}
					download
					className='px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition'
				>
					Download
				</a>
				<button
					onClick={handleRetry}
					className='px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-700 transition'
				>
					Retry
				</button>
			</div>
		</div>
	);
};

export default PosterDisplay;
