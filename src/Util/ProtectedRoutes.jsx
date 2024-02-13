import {useSelector} from "react-redux"
import {Navigate, useLocation} from "react-router-dom"
import PropTypes from 'prop-types'

const ProtectedRoute = ({children}) => {
    const user = useSelector((state) => state.user);
    let location = useLocation();


    if(!user.isAuthenticated) {
        return <Navigate to="/register" state={{ from: location}} replace />
    }
 return children

};

ProtectedRoute.propTypes = {
    children : PropTypes.element
}

export default ProtectedRoute;