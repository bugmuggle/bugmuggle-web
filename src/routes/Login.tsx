import { useState } from 'react'
import { z } from 'zod'
import pb from '../lib/pocketbase/client'
import { useNavigate } from 'react-router'

const FormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Invalid password')
})

const initialValues = {
  email: '',
  password: ''
}

type FormType = z.infer<typeof FormSchema>

export default function Login () {
  const navigate = useNavigate()

  const [form, setForm] = useState<FormType>(initialValues)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const email = form.email
    const password = form.password

    setLoading(true)

    pb.collection("users").authWithPassword(email, password)
      .then((response) => {
        navigate('/')
        return
      })
      .catch(error => {
        setErrorMsg(error.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="card bg-base-100 w-96">
        <div className="card-body select-none space-y-3">
          <h2 className="card-title">Login</h2>
          {
            errorMsg &&
            <div role="alert" className="alert alert-error">
              <span>{errorMsg}</span>
            </div>
          }
          <form className="space-y-3" onSubmit={handleSubmit}>
            <input
              type="text"
              name="email"
              placeholder="Email"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input input-bordered w-full"
              onChange={handleChange}
            />
            <button type="submit" className="btn btn-primary w-full">Continue</button>
          </form>
        </div>
      </div>
    </div>
  )
}
