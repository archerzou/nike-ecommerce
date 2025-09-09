'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import SocialProviders from './SocialProviders'

type AuthFormProps = { mode: 'signin' | 'signup' }

export default function AuthForm({ mode }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const isSignUp = mode === 'signup'

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-center">
        {isSignUp ? 'Join Nike Today!' : 'Welcome back'}
      </h1>
      <p className="text-center mt-2 text-dark-700">
        {isSignUp ? 'Create your account to start your fitness journey' : 'Sign in to continue'}
      </p>

      <div className="mt-6">
        <SocialProviders mode={mode} />
      </div>

      <div className="relative my-6 flex items-center">
        <div className="h-px flex-1 bg-light-300" />
        <span className="px-4 text-xs text-dark-500">
          Or {isSignUp ? 'sign up' : 'sign in'} with
        </span>
        <div className="h-px flex-1 bg-light-300" />
      </div>

      <form noValidate className="space-y-4">
        {isSignUp && (
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              className="w-full rounded-xl border border-light-300 bg-light-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-dark-900"
              autoComplete="name"
            />
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="johndoe@gmail.com"
            className="w-full rounded-xl border border-light-300 bg-light-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-dark-900"
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="minimum 8 characters"
              className="w-full rounded-xl border border-light-300 bg-light-100 px-4 py-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-dark-900"
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-2 grid place-items-center px-2 text-dark-700 hover:text-dark-900"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <span className="text-xs">{showPassword ? 'Hide' : 'Show'}</span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-dark-900 text-light-100 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>

        <p className="text-xs text-center text-dark-700">
          {isSignUp ? (
            <>
              By signing up, you agree to our{' '}
              <Link href="#" className="underline underline-offset-2">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="#" className="underline underline-offset-2">
                Privacy Policy
              </Link>
            </>
          ) : (
            <Link href="#" className="underline underline-offset-2">
              Forgot your password?
            </Link>
          )}
        </p>
      </form>
    </div>
  )
}
