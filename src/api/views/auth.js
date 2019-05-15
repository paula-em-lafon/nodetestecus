import express from 'express'

import { createJWToken } from '../../lib/auth'

export function createTokenView(req, res){
    res.status(200)
        .json({
        success: true,
        token: createJWToken({
            sessionData: {user:1},
            maxAge: 3600
        })
    })
}
export function verifyTokenView(req, res){
    res.status(200)
    .json({
      success: true,
      data: "Super secret data!"
    })
};