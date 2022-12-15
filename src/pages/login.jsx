import React from "react";
import { useSession, signIn, signOut, getSession } from "next-auth/react";


const login = () => {
  const { data: session } = useSession();
  //console.log(session); //me va a dar  objeto con la info de la sesion


  /* function handleSignIn(e) {
    e.preventDefault();
  
    signIn();
    //deberia pregunta si existe user en DB - existe, redirect home, mno existe, crea registro DB - a form
    //pongo buleano como test
    if (false) {
      return {
        redirect: {
          destination: "/",
        },
      };
    } else {
      return {
        redirect: {
          destination: "/register",
        },
      };
    }
  } */





  if (session) {
    return (
      <div>
        <p>{session.user.email}, estas logueado</p>
        <button onClick={() => signOut()}>Cerrar Sesión</button>
      </div>
    );
  } else {
    return (
      <div>
        <p>Login</p>
        <button onClick={() => signIn()}>Iniciar Sesión</button>
      </div>
    );
  }
};

export default login;


/* export const getServerSideProps = async (context) => {
  const session = await getSession(context);
   //deberia pregunta si existe user en DB - existe, redirect home, mno existe, crea registro DB - a form
  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  } else if (false) {
    return {
      redirect: {
        destination: "/register",
      },
    };
  } else {
    return {
      props: { session },
      redirect: {
        destination: "/productList",
      },
    };
  }

};
 */