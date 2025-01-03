import {Link, Outlet} from "react-router-dom";

export default function Root() {
  return (
    <>
      <nav>
        <ul>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/auth">Sign up or Log in</Link></li>
        </ul>
      </nav>
      <Outlet/>
    </>
  );
};
