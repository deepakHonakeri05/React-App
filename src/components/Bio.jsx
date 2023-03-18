import profileIcon from '../assets/profileIcon.svg'
import { useEffect, useState } from 'react'
import getPhotoUrl from 'get-photo-url'
import db from '../dexie'

const Bio = ()=>{

    const [userDetails, setUserDetails] = useState({
        name : ' ',
        about:' '
    })  

    const [editFormisOpen,setEditFromIsOpen] = useState(false)
    const[profilePhoto, setProfilePhoto] = useState(profileIcon)

    useEffect(()=> {
        const setDataFromDb = async () => {
            const userDetailsFromDb = await db.bio.get('info')
            const profilePhotoFromDb = await db.bio.get('profilePhoto')
            userDetailsFromDb && setUserDetails(userDetailsFromDb)
            profilePhotoFromDb && setProfilePhoto(profilePhotoFromDb)
        }

        setDataFromDb()
    }, [])
    
    const updateUserDetails = async (event) =>{
        event.preventDefault()
        const objectData = {
            name: event.target.nameOfUser.value,
            about : event.target.aboutUser.value
        }
        setUserDetails(objectData)
        await db.bio.put(objectData, 'info')
        setEditFromIsOpen(false)
    }

    const editFormButton = <button onClick={() => setEditFromIsOpen(true)}>Edit</button> 

    const updateProfilePhoto = async () =>{
        const newPhoto = await getPhotoUrl('#profilePhotoInput')
        setProfilePhoto(newPhoto)
        
        await db.bio.put(newPhoto,'profilePhoto')
    }

    const editForm = (
        <form className='edit-bio-form' onSubmit={(e)=> updateUserDetails(e)}>
            <input type="text" name='nameOfUser' defaultValue={userDetails?.name} placeholder='edit your name'></input>
            <input type="text" name='aboutUser' defaultValue={userDetails?.about} placeholder='edit your bio'></input>
            <br/>
            <button type='button' className='cancel-button' onClick={() => setEditFromIsOpen(false)}>cancel</button>
            <button type='submit'>save</button>
        </form>
    )
    return (
        <section className="bio">
            <input type="file" accept='image/*' name="photo" id= "profilePhotoInput"/>
            <label htmlFor='profilePhotoInput' onClick={updateProfilePhoto}>
                <div className="profile-photo" role="button" title="click to edit photo">
                    <img src={profilePhoto} alt="profile"></img>
                </div>
            </label>
            <div className="profile-info">
                <p className='name'>{userDetails.name}</p>
                <p className='about'>{userDetails.about}</p>
                {editFormisOpen ? editForm : editFormButton}
            </div>
        </section>
    )

}

export default Bio;