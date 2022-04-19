import './App.css';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import firebaseApp from './firebase.init'
import { Button, Form } from 'react-bootstrap';
import { useState } from 'react';
document.body.style = 'background: #F2F4FB;';


const auth = getAuth(firebaseApp);

function App() {
  const [userName, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false); /* react bootstrap */
  const [errorText, setErrorText] = useState('');
  const [existingAccount, setExistingAccount] = useState(false);
  const [verificationText, setVerificationText] = useState('');
  const [resetPassword, setResetPassword] = useState('');

  const onBlurUserName = event => {
    setUsername(event.target.value)
  };
  const onblurEmail = event => {
    setEmail(event.target.value);
  };
  const onblurPass = event => {
    setPassword(event.target.value);
  };
  const handleExistingAccountLogIn = event => {
    setExistingAccount(event.target.checked);
  };
  const handleForgotPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setResetPassword('An email has been sent to your mail address. Please check inbox/spam and click on the link to reset password. ')
      })
      .catch(error => {
        setErrorText(error.message)
      })
  };
  const handleEmailVerification = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        setVerificationText('A verification email sent to the address. Please check inbox/spam and click on the link to verify. ')
      })
  };

  /* to update all info of user to firebase. just put info separated by comma in the second parameter */
  const userProfile = () => {
    updateProfile(auth.currentUser, {
      displayName: userName
    })
      .then(() => {

      })
      .catch(error => {
        setErrorText(error.message)
      })
  }
  const handleFormOnSubmit = event => {
    event.preventDefault();
    /* email/pass validation from react bootstrap  */
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return; /* we set it . If validation is false then that will not go further and firebase will not showe any error */
    }
    /* set password checking with regular expression */
    if (!/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password)) {
      setErrorText('Password must contain at least a lowercase, an uppercase, a number and a special character')
      return;
    }
    setValidated(true); /* react bootstrap */
    setErrorText(''); /* means is password passes the criteria then no error will be shown */
    if (existingAccount) {
      signInWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          console.log(user);
        })
        .catch(error => {
          console.error(error)
          setErrorText(error.message)
        })

    }
    else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          console.log(user);
          setEmail('');
          setPassword('')
          handleEmailVerification();
          userProfile();
        })
        .catch(error => {
          setErrorText(error.message)
        })
    }
  }
  return (
    <div className="">
      <div className="container">
        <h1 className='text-center mt-5 mb-3 fw-bolder text-success display-5'>  Firebase Authentication</h1>
        <div className="row my-5">
          <div className="col-md-8">
            <img style={{ height: '530px' }} className='w-100 rounded-3' src={'https://img.freepik.com/free-vector/account-concept-illustration_114360-399.jpg?t=st=1649461008~exp=1649461608~hmac=26ad965fa5b6aab0b536bb57cc993b45f968442847d30030cb51ed1bafd645c4&w=740'} alt="" />
          </div>
          <div className="col-md-4 shadow my-auto rounded-3 p-4">
            <h3 className='fw-bolder text-success '>Please {existingAccount ? 'Log in' : 'Register'}</h3>
            <Form noValidate validated={validated} onSubmit={handleFormOnSubmit}>
              {/* conditional rendering */}
              {
                !existingAccount &&
                <Form.Group className="mb-3" controlId="validationCustom01">
                  <Form.Label>Full name</Form.Label>
                  <Form.Control required onBlur={onBlurUserName} type="text" placeholder="Your full name" />
                  <Form.Text className="text-muted">
                    Write your full name in capital letters.
                  </Form.Text>
                </Form.Group>
              }
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control required onBlur={onblurEmail} type="email" placeholder="Enter email" />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
                <Form.Control.Feedback type="invalid">
                  Please provide a valid email address
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control required onBlur={onblurPass} type="password" placeholder="Password" />
                <Form.Control.Feedback type="invalid">
                  Input your password correctly
                </Form.Control.Feedback>
              </Form.Group>
              {/* password error message */}
              <small className='text-danger'>{errorText}</small>
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check onChange={handleExistingAccountLogIn} type="checkbox" label="Already have an account ?" />
              </Form.Group>
              {/* conditional rendering to display reset email link sent */}
              {
                resetPassword && <small className='text-info'>{resetPassword}</small>
              }
              <br />
              { /* means when everything is okay then email verification success message will be appeared and will disappear when log in */
                validated && <small className='text-info' >{existingAccount ? '' : verificationText}</small>
              }

              { /* means when user clicks on the already have account check mark then this button will be displayed */
                existingAccount && <Button onClick={handleForgotPassword} variant="link">Forgot password ?</Button>
              } <br />

              {/* conditional rendering for toggle button and when to be enabled, disabled*/}
              {
                !password || errorText ? <Button disabled variant="success" type="submit">
                  {existingAccount ? 'Log in' : 'Register'}
                </Button> : <Button variant="success" type="submit">
                  {existingAccount ? 'Log in' : 'Register'}
                </Button>
              }
            </Form>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
