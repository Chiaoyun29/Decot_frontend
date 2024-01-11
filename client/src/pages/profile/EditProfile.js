import React, { useState, useEffect } from 'react';
import { updateProfile, deleteAccount, verifyEnteredPassword, changePassword, uploadProfilePic } from '../../components/services/api'; // Assuming you have this API function
import CustomModal from '../../components/common/CustomModal';
import { Link, useNavigate } from 'react-router-dom';

const EditProfile = ({ user,  setUser,isEditing, setIsEditing, onCancel }) => {
    const [username, setUsername] = useState(user.username || '');
    const [password, setPassword] = useState('');
    const [expertise, setExpertise] = useState(user.expertise || '');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [verifyPasswordModalIsOpen, setVerifyPasswordModalIsOpen] = useState(false);
    const [changePasswordModalIsOpen, setChangePasswordModalIsOpen] = useState(false);
    const [deleteConfirmationModalIsOpen, setDeleteConfirmationModalIsOpen] = useState(false);
    const [enteredCurrentPassword, setEnteredCurrentPassword] = useState('');
    const [updateSuccessModalIsOpen, setUpdateSuccessModalIsOpen] = useState(false);
    const [isPasswordVerified, setIsPasswordVerified] = useState(false);
    const [message, setMessage] = useState('');
    const [messageTitle, setMessageTitle] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const navigate = useNavigate();
    const isDirectRegistration = user.registeredVia === "Direct";
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(user.profilePic || "/image/user.png");

  useEffect(() => {
    setUsername(user.username);
    setExpertise(user.expertise);
  }, [user]);

    useEffect(() => {
        setPassword('');
        setConfirmPassword('');
        setIsPasswordVerified(false);
        setUpdateSuccessModalIsOpen(false);
        setMessage('');
        setMessageTitle('');
    }, [isEditing]);

    const handleProfileUpdate = async () => {
        try {
            // Check if password needs to be changed and has been verified
            if (isPasswordVerified && password && confirmPassword) {
                if (password !== confirmPassword) {
                    setMessageTitle('Error');
                    setMessage('New password and confirmation password do not match');
                    setModalIsOpen(true);
                    return;
                } else {
                    const passwordResponse = await changePassword(user.id, password);
                    if (passwordResponse.message !== 'Password changed successfully') {
                        const errorData = await passwordResponse.json();
                        setMessageTitle('Error');
                        setMessage(errorData.error || 'Failed to change password');
                        setModalIsOpen(true);
                        return;
                    }
                }
            }

            // Upload profile picture if selected
            if (selectedFile) {
                const uploadResponse = await uploadProfilePic(user.id, selectedFile);
                console.log(uploadResponse)
                if (uploadResponse.profilePicUrl) {
                    setUser(prevUser => ({ ...prevUser, profilePic: uploadResponse.profilePicUrl }));
                } else {
                    setMessageTitle('Error');
                    setMessage(uploadResponse.error || 'Failed to upload profile picture');
                    setModalIsOpen(true);
                }
            }

            // Update profile details
            const profileResponse = await updateProfile(user.id, username, expertise);
            if (!profileResponse.user) {
                const errorData = await profileResponse.json();
                setMessageTitle('Error');
                setMessage(errorData.error || 'Failed to update profile');
                setModalIsOpen(true);
                return;
            }

            // If all operations are successful
            setUser({ ...profileResponse.user });
            setUpdateSuccessModalIsOpen(true);

        } catch (error) {
            setMessageTitle('Error');
            setMessage('An error occurred while trying to update profile');
            setModalIsOpen(true);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await deleteAccount(user.id);
            navigate("/");
        } catch (error) {
            setMessageTitle('Error');
            setMessage('An error occurred while trying to delete the account');
            setModalIsOpen(true);
        }
    };

    const handleVerifyEnteredPassword = async () => {
        console.log(enteredCurrentPassword)
        try {
            const response = await verifyEnteredPassword(user.id, enteredCurrentPassword);
            if (response.verified) {
                setIsPasswordVerified(true);
                setVerifyPasswordModalIsOpen(false);
            } else {
                setVerifyPasswordModalIsOpen(false);
                setEnteredCurrentPassword('');
                setMessageTitle('Error');
                setMessage('Incorrect password');
                setModalIsOpen(true);
            }
        } catch (error) {
            setMessageTitle('Error');
            setMessage('An error occurred while trying to verify the password');
            setModalIsOpen(true);
        }
    };

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file)); // Creates a preview URL
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <form className="space-y-12">
                {/* Profile Section */}
                <div className="border-b border-gray-900/10 pb-4">
                <h2 className="text-xl font-semibold mb-4">Edit Profile</h2> {/* Edit Profile page */}
                <div className="mb-4">
                    <img 
                        src={previewUrl} 
                        alt="Profile Preview" 
                        className="w-20 h-20 rounded-full object-cover mx-auto" // Adjust size as needed
                    />
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        className="mt-2"
                    />
                </div>
                <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                        <label htmlFor="username" className="block font-semibold text-sm font-medium leading-6 text-gray-900">Username</label>
                        <div className="mt-2 mb-4">  {/* Added mb-4 for spacing */}
                            <input
                                type="text"
                                name="username"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    {user.role === "mentor" && (
                        <div className="sm:col-span-4">
                            <label htmlFor="expertise" className="block font-semibold text-sm font-medium leading-6 text-gray-900">Expertise</label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="expertise"
                                    id="expertise"
                                    value={expertise}
                                    onChange={(e) => setExpertise(e.target.value)}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                            </div>
                        </div>
                    )}
                </div>
                </div>
                <div className="border-b border-gray-900/10 pb-5">
                <h2 className="text-lg font-semibold leading-7 text-gray-900">Account Management</h2>
                <div className="mt-4 flex space-x-4">
                    {isDirectRegistration && (
                        <div>
                            {!isPasswordVerified ? (
                                <button
                                    type="button"
                                    onClick={() => setVerifyPasswordModalIsOpen(true)}
                                    className="px-4 py-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-700 focus:outline-none"
                                >
                                    Change Password
                                </button>
                            ) : (
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full mt-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        placeholder="Enter new password"
                                    />
                                    <label htmlFor="confirmPassword" className="block mt-4 text-sm font-medium leading-6 text-gray-900">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="block w-full mt-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Account Deletion Section - Available for all users */}
                    <div>
                        <button
                            type="button"
                            onClick={() => setDeleteConfirmationModalIsOpen(true)}
                            className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-700 focus:outline-none"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
               

                {/* Save & Cancel buttons */}
                <div className="mt-6 flex items-center justify-end gap-x-2">
                    <button
                        className="rounded-md bg-gray-300 px-4 py-2 text-sm font-semibold text-black shadow-sm hover:bg-gray-400 focus-visible:outline focus-visible:outline-2"
                        onClick={() => setIsEditing(false)}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleProfileUpdate}
                        className="ml-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Save
                    </button>
                </div>

                <CustomModal
                    isOpen={modalIsOpen}
                    onClose={() => setModalIsOpen(false)}
                    title={messageTitle}
                    message={message}
                />

                <CustomModal
                    isOpen={updateSuccessModalIsOpen}
                    onClose={() => {
                        setUpdateSuccessModalIsOpen(false);
                        setIsEditing(false);
                    }}
                    title="Success"
                    message="Profile updated successfully"
                >
                    <div className="mt-4 flex items-center justify-end gap-x-2">
                        <button
                            type="button"
                                className="rounded-md bg-gray-300 px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-gray-400 focus-visible:outline focus-visible:outline-2"
                            onClick={() => navigate("/dashboard")}
                        >
                            Back to dashboard
                        </button>
                        <button
                            type="button"
                            className="ml-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={() => {
                                setIsEditing(false);  // Set editing state to false
                            }}
                        >
                            View Profile
                        </button>
                    </div>
                </CustomModal>

                <CustomModal
                    isOpen={verifyPasswordModalIsOpen}
                    onClose={() => setVerifyPasswordModalIsOpen(false)}
                    title="Verify Current Password"
                    message="Enter your current password to continue."
                >
                    <div className="mt-4">
                        <input
                            type="password"
                            placeholder="Enter current password"
                            value={enteredCurrentPassword}
                            onChange={(e) => setEnteredCurrentPassword(e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        <button
                            className="mt-4 px-4 py-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-700 focus:outline-none"
                            onClick={handleVerifyEnteredPassword}
                        >
                            Verify
                        </button>
                    </div>
                </CustomModal>

                <CustomModal
                    isOpen={changePasswordModalIsOpen}
                    onClose={() => setChangePasswordModalIsOpen(false)}
                    title="Change Password"
                    message="Enter your current password to continue."
                >
                    <div className="mt-4">
                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={enteredCurrentPassword}
                            onChange={(e) => setEnteredCurrentPassword(e.target.value)}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        <button
                            className="mt-4 px-4 py-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-700 focus:outline-none"
                            onClick={handleVerifyEnteredPassword}
                        >
                            Verify
                        </button>
                    </div>
                </CustomModal>

                <CustomModal
                    isOpen={deleteConfirmationModalIsOpen}
                    onClose={() => setDeleteConfirmationModalIsOpen(false)}
                    title="Confirm Deletion"
                    message="Are you sure you want to delete your account? This action cannot be undone."
                >
                    <div className="mt-4 flex items-center justify-end gap-x-2">
                        <button
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
                            onClick={() => setDeleteConfirmationModalIsOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="ml-4 px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-700 focus:outline-none"
                            onClick={handleDeleteAccount}
                        >
                            Confirm Delete
                        </button>
                    </div>
                </CustomModal>
            </form>
        </div>
    );
};

export default EditProfile;

