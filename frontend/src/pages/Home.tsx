import { Link } from "react-router-dom"


const Home = () => {
  return (
    <div>
        <div className="grid justify-center items-center">
            <p className="font-bold text-3xl">YNS-ERP</p>
            <div className="border-1 border-black grid items-center justify-center px-5 py-5">

                <Link to={"/signup"}>
                <button className="bg-gray-500 border-black px-2 py-2 rounded-3xl text-white mr-3">Sign up</button> <br />
                </Link>

                <Link to={"/signin"}>
                <button className="bg-gray-500 border-black px-2 py-2 rounded-3xl text-white mr-3">Sign in</button> <br />                
                </Link>

                <Link to={"/create-company"}>
                <button className="bg-gray-500 border-black px-2 py-2 rounded-3xl text-white">Create Company</button>
                </Link>
                



            </div>
        </div>
      
    </div>
  )
}

export default Home
