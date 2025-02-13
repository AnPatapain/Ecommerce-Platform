import {base64Logo} from "./base64Logo";

export const VERIFICATION_EMAIL_TEMPLATE = (verificationEndpoint: string) => {
    return `
        <img alt='logo' width="50" src=${base64Logo} style="border-radius: 5%"/>
        
        <br/>
        
        <h3>Verify your email</h3>
        <p>Click the button below to verify your account. This button will expire in 1 hour</p>
        
        <a href=${verificationEndpoint}>
            <button>Verify</button>
        </a>
        
        <p>
            Thank you!
            <br/>
            ECM team
        </p>
    `
};

export const RESET_PASSWORD_TEMPLATE = (resetPasswordEndpoint: string) => {
    return `
        <img alt='logo' width="50" src=${base64Logo} style="border-radius: 5%"/>
        
        <br/>
        
        <h3>Reset password</h3>
        <p>Click the button below to reset your password. This button will expire in 1 hour</p>
        
        <a href=${resetPasswordEndpoint}>
            <button>Go to reset password page</button>
        </a>
        
        <p>
            Thank you!
            <br/>
            ECM team
        </p>
    `
}

export const RESET_SELLER_PASSWORD_TEMPLATE = (resetPasswordEndpoint: string) => {
    return `
        <img alt='logo' width="50" src=${base64Logo} style="border-radius: 5%"/>
        
        <br/>
        
        <h3>Admin has created a seller account for you</h3>
        <p>Click the button below to reset your password. This button will expire in 1 hour</p>
        
        <a href=${resetPasswordEndpoint}>
            <button>Go to reset password page</button>
        </a>
        
        <p>
            Thank you!
            <br/>
            ECM team
        </p>
    `
}