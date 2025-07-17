import React, { useEffect, useState } from 'react'
import { Alert, Button, FileInput, TextInput } from 'flowbite-react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase.js';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux'
import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from '@mui/material';

export default function UpdatePost() {
    const { currentUser } = useSelector(state => state.user)
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({});
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [publishError, setPublishError] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const { postId } = useParams();
    const navigate = useNavigate()

    //ImageUpload
    const handleUploadImage = async () => {
        const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

        if (!file) {
            setImageUploadError('Please select an image');
            return; // Exit early if no file is selected
        }

        if (file.size > MAX_FILE_SIZE) {
            setImageUploadError('File size exceeds 2MB');
            return; // Exit early if the file is too large
        }
        setImageUploadError(null);
        try {
            // if (!file) {
            //     setImageUploadError('Please Select an Image');
            // }
            //setImageUploadError(null);
            const storage = getStorage(app);
            const fileName = new Date().getTime() + '-' + file.name;
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProgress(progress.toFixed(0));
                },
                (err) => {
                    setImageUploadError(err);
                    setImageUploadProgress(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageUploadProgress(null);
                        setImageUploadError(null);
                        setFormData({ ...formData, image: downloadURL })
                    })
                }
            )

        } catch (err) {
            setImageUploadError('Image upload Failed');
            setImageUploadProgress(null);
            //console.log(err)
        }
    }
    //Form Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (!res.ok) {
                setPublishError(data.message)
                return
            }
            if (res.ok) {
                setPublishError(null);
                navigate(`/post/${data.slug}`)

            }
        } catch (err) {
            setPublishError('Something went Wrong')
        }

    }

    const handleChange = (event, newValue) => {
        // Limit the selection to 2 options
        setSelectedOptions(newValue);
        setFormData(prevFormData => ({
            ...prevFormData,
            category: newValue // Ensure `category` is an array of selected values
        }));
    };

    const categorytags = ['Algorithms', 'Data Structures', 'Machine Learning', 'Artificial Intelligence', 'Web Development', 'Cybersecurity', 'Database Systems', 'Operating Systems', 'Computer Networks', 'Software Engineering', 'Cloud Computing', 'Big Data', 'Blockchain', 'Computer Vision', 'Natural Language Processing', 'natural-language-processing'
    ];

    //console.log(formData)


    useEffect(() => {

        const fetchPost = async () => {
            try {
                const res = await fetch(`/api/post/getposts?postId=${postId}`)
                const data = await res.json()
                if (!res.ok) {
                    console.log(data.message);
                    setPublishError(data.message);
                    return;
                }
                if (res.ok) {
                    setPublishError(null)
                    setFormData(data.posts[0]);
                    setSelectedOptions(data.posts[0].category)
                    //console.log(data.posts[0])
                }

            } catch (err) {
                console.log(err.message);
            }
        }
        fetchPost();
    }, [postId]);

    //console.log(formData.image)
    return (
        <div className='p-6 max-w-3xl mx-auto min-h-screen'>
            <h1 className="text-center text-3xl my-7 font-semibold">Update  Post</h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 ">
                    <TextInput
                        type='text'
                        placeholder='Title '
                        required
                        id='title'
                        className='w-full'
                        onChange={
                            (e) => setFormData({ ...formData, title: e.target.value })
                        }
                        value={formData.title}
                    />
                    {/* <Select
                        onChange={
                            (e) => setFormData({ ...formData, category: e.target.value })
                        }
                    >
                        <option value="uncategorized" className="">Select a category</option>
                        <option value="javascript">JavaScript</option>
                        <option value="nodejs">Nodejs</option>
                        <option value="nextjs">Nextjs</option>
                        <option value="mongodb">Mongodb</option>
                    </Select> */}
                    <div className="my-4 ">
                        <Autocomplete
                            multiple
                            limitTags={2}
                            id="multiple-limit-tags"
                            options={categorytags}
                            value={selectedOptions}
                            onChange={handleChange}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Tags"
                                    placeholder="Select tags"
                                    variant="outlined"
                                    className="w-full"
                                />
                            )}
                        />
                    </div>

                </div>
                <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                    <FileInput type='file' accept='image/*' onChange={(e) => setFile(e.target.files[0])} />
                    <Button
                        type='button'
                        gradientDuoTone='purpleToBlue'
                        size='sm'
                        outline
                        onClick={handleUploadImage}
                        disabled={imageUploadProgress}
                    >
                        {
                            imageUploadProgress ?
                                <div className="w-16 h-16">
                                    <CircularProgressbar
                                        value={imageUploadProgress}
                                        text={`${imageUploadProgress || 0}%`}
                                    />
                                </div>
                                : 'Upload Image'
                        }
                        {/* Upload Image */}
                    </Button>
                </div>
                {imageUploadError && (
                    <Alert color='failure'>
                        {imageUploadError}
                    </Alert>
                )}
                {formData.image && (
                    <img
                        src={formData.image}
                        alt='upload'
                        className='w-full h-72 object-cover'
                    />
                )}
                <ReactQuill
                    theme='snow'
                    placeholder='Write Something...'
                    className='h-72 mb-12'
                    required
                    onChange={
                        (value) => {
                            setFormData({ ...formData, content: value })
                        }
                    }
                    value={formData.content}
                />
                <Button
                    type='submit'
                    gradientDuoTone='purpleToPink'
                >
                    Update
                </Button>
                {
                    publishError &&
                    <Alert
                        color='failure'
                        className='mt-5'
                    >
                        {publishError}
                    </Alert>
                }
            </form>


        </div>
    )
}
