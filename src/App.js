import Login from '../src/Components/Login/Index'
import Register from '../src/Components/Register/Index'
import WrapMain from '../src/Components/WrapMain/Index'
import { BrowserRouter as Router, Route } from 'react-router-dom'
function App() {
	return (
		<Router>
			<Route path='/' component={Login} exact />
			<Route component={Login} path='/login' exact />
			<Route component={Register} path='/register' exact />
			<Route component={WrapMain} path='/main' exact />
		</Router>
	)
}

export default App
