import { Link } from 'react-router-dom'

export default function ComingSoon({ title, step }) {
  return (
    <section className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-3 text-soft">{step ? `This page is built in ${step} of the build guide.` : 'We could not find that page.'}</p>
      <Link to="/" className="mt-6 inline-block rounded-xl bg-teal px-5 py-3 font-semibold text-white hover:bg-teal-dark">
        Back to home
      </Link>
    </section>
  )
}
