import { IonIcon } from '@ionic/react'
import { eyeOutline , eyeOffOutline } from 'ionicons/icons'

export default function password({hide , func}) {
  return (
    <div className='relative w-full'>
    <input className='w-full' type={ hide ? "password" : "text"} name="password" id="password" />
    <span onClick={func} className='absolute right-0 mr-2 top-1/2 -translate-y-1/2 '> <IonIcon className='text-3xl cursor-pointer' icon={ hide ? eyeOutline : eyeOffOutline} /> </span>
    </div>  
  )
}
