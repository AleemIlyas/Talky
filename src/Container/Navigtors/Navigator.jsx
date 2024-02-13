import PropTypes from 'prop-types'

export default function Navigator({ text , active , func }) {
  return (
    <p onClick={func} className={['font-bold text-xl pt-2 pb-2 rounded-full pl-4 pr-4 cursor-pointer' , active ? ' text-white' : 'text-black'].join(' ')} >
        {text}
    </p>
  )
}

Navigator.propTypes = {
    text : PropTypes.string,
    active : PropTypes.bool,
    func : PropTypes.func
}