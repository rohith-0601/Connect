
import UserLayout from "@/layout/ClientLayout";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";


const inter = Inter({ subsets: ["latin"] });

export default function Home() {

  const router = useRouter();
  return (
    <UserLayout>
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
     <div className="container">
      <div className="row align-items-center">
        <div className="col-md-6 p-5 "  >

          <p style={{fontSize:"3rem"}} >Connect with friends  </p>

          <div onClick={()=>{
            router.push("/login")
          }} className="btn btn-primary w-auto">
            Join Now
          </div>
        </div>
        <div className="col-md-6">

          <img src="images/558.Team-Spirit.png" alt="Home image"  className="img-fluid" />
        </div>
      </div>
     </div>
     </div>
    </UserLayout>
    
  );
}
