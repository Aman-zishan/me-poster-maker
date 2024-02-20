'use client';
import { useRouter } from 'next/navigation';
import { useState, ChangeEvent, FormEvent } from 'react';
import { ImageDataAtom } from './store/imagestore';
import { useAtom } from 'jotai';

interface FormData {
	bg_prompt: string;
	webinar_title: string;
	webinar_description: string;
	webinar_date_time: string;
	speaker_name: string;
	speaker_designation: string;
}

const CreatePoster = () => {
	const router = useRouter();
	const [, setImageAtom] = useAtom(ImageDataAtom);
	const [formData, setFormData] = useState<FormData>({
		bg_prompt: '',
		webinar_title: '',
		webinar_description: '',
		webinar_date_time: '',
		speaker_name: '',
		speaker_designation: '',
	});

	const [speakerPhoto, setSpeakerPhoto] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			setSpeakerPhoto(file);
			setPreviewUrl(URL.createObjectURL(file));
		}
	};

	const handleClearPhoto = () => {
		setSpeakerPhoto(null);
		setPreviewUrl(null);
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		const form = new FormData();
		Object.keys(formData).forEach((key) => {
			form.append(key, formData[key as keyof FormData]);
		});
		if (speakerPhoto) form.append('speaker_photo', speakerPhoto);

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_BACKEND_URL}/generate_webinar_poster`,
				{
					method: 'POST',
					body: form,
				},
			);
			const data = await response.json();
			console.log(data);
			setIsLoading(false);
			if (data.image) {
				setImageAtom(data.image);
				router.push(`/poster-display`);
			}

			// Handle success, show preview, offer download, etc.
		} catch (err) {
			console.error(err);
			// Handle error
		}
	};

	return (
		<div className='container mx-auto p-4 mt-10 bg-[#101827] shadow-lg rounded-lg'>
			<h2 className='text-2xl font-bold text-center text-white my-4'>
				ME Webinar Poster Generator
			</h2>
			<h4 className='text-md font-bold text-center text-white my-4'>
				note: add a "/" whenever you want a newline
			</h4>
			{isLoading ? (
				<div className='flex justify-center items-center'>
					<img
						className='w-20 h-20 animate-spin'
						src='https://www.svgrepo.com/show/199956/loading-loader.svg'
						alt='Loading icon'
					/>
				</div>
			) : (
				<form onSubmit={handleSubmit} className='space-y-6 px-8 py-6'>
					<div>
						<label
							htmlFor='bg_prompt'
							className='block text-white font-medium mb-2'
						>
							Background Image Prompt
						</label>

						<input
							required
							type='text'
							id='bg_prompt'
							name='bg_prompt'
							value={formData.bg_prompt}
							onChange={handleChange}
							className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
						/>
					</div>

					<div>
						<label
							htmlFor='webinar_title'
							className='block text-white font-medium mb-2'
						>
							Webinar Title
						</label>
						<input
							placeholder='ME/WEBINAR'
							required
							type='text'
							id='webinar_title'
							name='webinar_title'
							value={formData.webinar_title}
							onChange={handleChange}
							className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
						/>
					</div>

					<div>
						<label
							htmlFor='webinar_description'
							className='block text-white font-medium mb-2'
						>
							Webinar Description
						</label>
						<textarea
							required
							id='webinar_description'
							name='webinar_description'
							value={formData.webinar_description}
							onChange={handleChange}
							className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
						></textarea>
					</div>

					<div>
						<label
							htmlFor='webinar_date_time'
							className='block text-white font-medium mb-2'
						>
							Webinar Date & Time
						</label>
						<input
							placeholder='WEDNESDAY/21 FEB 2024/8:00 PM'
							required
							type='text'
							id='webinar_date_time'
							name='webinar_date_time'
							value={formData.webinar_date_time}
							onChange={handleChange}
							className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
						/>
					</div>

					<div>
						<label
							htmlFor='speaker_name'
							className='block text-white font-medium mb-2'
						>
							Speaker Name
						</label>
						<input
							required
							type='text'
							id='speaker_name'
							name='speaker_name'
							value={formData.speaker_name}
							onChange={handleChange}
							className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
						/>
					</div>

					<div>
						<label
							htmlFor='speaker_designation'
							className='block text-white font-medium mb-2'
						>
							Speaker Designation
						</label>
						<input
							required
							type='text'
							id='speaker_designation'
							name='speaker_designation'
							value={formData.speaker_designation}
							onChange={handleChange}
							className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
						/>
					</div>

					<div>
						<label
							htmlFor='speaker_photo'
							className='block text-white font-medium mb-2'
						>
							Speaker Photo
						</label>
						<input
							required
							type='file'
							id='speaker_photo'
							name='speaker_photo'
							onChange={handleFileChange}
							className='mt-1 block w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100'
						/>
						{previewUrl && (
							<div className='mt-4'>
								<img
									src={previewUrl}
									alt='Speaker Preview'
									className='max-w-xs max-h-40'
								/>
								<button
									type='button'
									onClick={handleClearPhoto}
									className='ml-4 text-sm text-red-500'
								>
									Clear Photo
								</button>
							</div>
						)}
					</div>

					<div className='text-center'>
						<button
							type='submit'
							className='inline-block px-6 py-2.5 bg-gradient-to-r from-green-400 to-blue-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gradient-to-bl focus:bg-gradient-to-br focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gradient-to-l transition duration-150 ease-in-out'
						>
							Generate Poster
						</button>
					</div>
				</form>
			)}
		</div>
	);
};

export default CreatePoster;
