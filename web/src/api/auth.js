import * as jwt from 'react-jwt';

export async function LoginUser(_email, _pass) {

    const response = await fetch(`/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: _email, password: _pass })
    })

    return await response.json();

}

export async function RegisterUser(_email, _pass) {

    const response = await fetch(`/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: _email, password: _pass })
    })

    return await response.json();

}

export function TokenIsValid(_token) {

    if (jwt.isExpired(_token)) {
        return false
    }
    return true
}