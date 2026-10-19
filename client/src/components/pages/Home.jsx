import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiArrowRight, FiMessageCircle, FiShield, FiPhoneOff, FiTag, FiMapPin, FiRepeat,
  FiChevronRight, FiTool, FiUsers, FiLock, FiCheck, FiClock, FiSend, FiHome,
} from 'react-icons/fi'
import { FaRupeeSign } from 'react-icons/fa'

const steps = [
  {
    title: 'Tell us what you need',
    text: 'Share your area, whether you want a home visit or a centre, and your budget. No diagnosis details needed.',
    chips: ['Area', 'Home or centre', 'Budget'],
  },
  {
    title: 'Compare nearby options',
    text: 'See physios near your area with their listed fees and why each one appears. Compare estimated costs for visits and for renting or buying equipment.',
    chips: ['Nearby first', 'Listed fees', 'Rent or buy'],
  },
  {
    title: 'Send a request',
    text: 'Send an appointment request to the physio. It is not a confirmed appointment until the physio accepts it.',
    chips: ['Physio confirms'],
  },
]

const benefits = {
  patients: [
    { icon: FiPhoneOff, title: 'Fewer phone calls', text: 'Compare physios and equipment in one place instead of calling around.' },
    { icon: FiTag, title: 'Clear listed fees', text: 'See each physio\u2019s listed session fee and the assumptions behind every cost estimate.' },
    { icon: FiMapPin, title: 'Nearby first', text: 'Results are ranked by how well they match your pincode, locality and city.' },
    { icon: FiRepeat, title: 'Rent instead of buying', text: 'Compare renting and buying equipment you may only need for a few weeks.' },
  ],
  physios: [
    { icon: FiMapPin, title: 'Patients near you', text: 'Requests are matched to your service areas, so you travel less between visits.' },
    { icon: FiClock, title: 'More time treating', text: 'Less travel time can mean more patients in the same day.' },
    { icon: FiTag, title: 'Simple, small fee', text: 'The idea is a small fee per completed appointment. This is a hypothesis we are still validating.' },
    { icon: FiUsers, title: 'Your own profile', text: 'Profiles, fees and availability management are on the roadmap.' },
  ],
}

const tools = [
  { to: '/planner', icon: FaRupeeSign, title: 'Smart Cost Planner', text: 'Compare home visits, centre visits, equipment rent and equipment buy.', badge: 'Estimates' },
  { to: '/equipment', icon: FiTool, title: 'Rehab Equipment Hub', text: 'Buy, rent or find used equipment, with live web results shown separately.', badge: 'Live search' },
  { to: '/nearby', icon: FiHome, title: 'Demo: Provider View', text: 'See how nearby patient requests look for a physiotherapist.', badge: 'Demo' },
]

const popular = ['Hand pulley', 'Walker', 'Wheelchair', 'TENS unit', 'Knee brace', 'Cervical collar']

export default function Home() {
  const [tab, setTab] = useState('patients')

  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* Hero */}
      <section className="grid items-center gap-8 py-8 md:grid-cols-2 md:py-14">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-soft">
            <span lang="hi">फिजियो साथी</span> · For patients and physiotherapists
          </p>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight md:text-5xl">
            Find a nearby physio and the right equipment,{' '}
            <span className="text-teal">without 20 phone calls</span>
          </h1>
          <p className="mt-4 max-w-lg text-base text-soft">
            Tell us what you need. We match you with physiotherapists near your area, compare costs, and show
            equipment you can rent or buy.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/find" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-navy px-6 font-semibold text-white shadow-sm hover:bg-navy/90">
              Find support <FiArrowRight aria-hidden />
            </Link>
            <Link to="/assistant" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line bg-white px-6 font-semibold hover:border-teal">
              <FiMessageCircle className="text-teal" aria-hidden /> Chat with AI Sathi
            </Link>
          </div>
          <p className="mt-4 flex items-start gap-2 rounded-xl border border-line bg-white p-3 text-xs text-soft">
            <FiShield className="mt-0.5 shrink-0 text-teal" aria-hidden />
            Prototype: the physios and equipment you see are sample data for the demo.
          </p>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-teal to-navy p-6 text-white shadow-md md:p-10">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/80">Care that comes to you</p>
          <p className="mt-3 text-2xl font-bold md:text-3xl">Recovery support, close to home.</p>
          <ul className="mt-5 space-y-2 text-sm text-white/90">
            <li className="flex items-center gap-2"><FiCheck aria-hidden /> Nearby physios, ranked with reasons</li>
            <li className="flex items-center gap-2"><FiCheck aria-hidden /> Clear cost comparison</li>
            <li className="flex items-center gap-2"><FiCheck aria-hidden /> Equipment to rent or buy</li>
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="py-6" aria-labelledby="how">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-dark">Care journey</p>
        <h2 id="how" className="mt-1 text-2xl font-bold">How Physio Sathi works</h2>
        <ol className="mt-5 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-2xl border border-line bg-white p-5 shadow-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mist font-bold text-teal-dark">{i + 1}</span>
              <h3 className="mt-3 text-lg font-bold">{s.title}</h3>
              <p className="mt-1 text-sm text-soft">{s.text}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {s.chips.map((c) => (
                  <span key={c} className="rounded-full bg-mist px-3 py-1 text-xs font-medium text-teal-dark">{c}</span>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Benefits */}
      <section className="py-8" aria-labelledby="why">
        <h2 id="why" className="sr-only">Why people use Physio Sathi</h2>
        <div className="inline-flex rounded-xl border border-line bg-white p-1" role="tablist">
          {[['patients', 'Why patients love us'], ['physios', 'For physiotherapists']].map(([key, label]) => (
            <button
              key={key}
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={`min-h-11 rounded-lg px-4 text-sm font-semibold ${tab === key ? 'bg-navy text-white' : 'text-soft'}`}
            >
              {label}
            </button>
          ))}
        </div>
        <ul className="mt-5 grid gap-4 md:grid-cols-2">
          {benefits[tab].map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-3 rounded-2xl border border-line bg-white p-4">
              <Icon className="mt-1 shrink-0 text-xl text-teal" aria-hidden />
              <div>
                <h3 className="font-bold">{title}</h3>
                <p className="mt-0.5 text-sm text-soft">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Tools */}
      <section className="py-6" aria-labelledby="tools">
        <h2 id="tools" className="text-2xl font-bold">Recovery tools</h2>
        <ul className="mt-5 grid gap-4 md:grid-cols-3">
          {tools.map(({ to, icon: Icon, title, text, badge }) => (
            <li key={title}>
              <Link to={to} className="flex h-full items-center gap-4 rounded-2xl border border-line bg-white p-4 shadow-sm hover:border-teal">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-mist text-xl text-teal-dark">
                  <Icon aria-hidden />
                </span>
                <span className="flex-1">
                  <span className="flex items-center gap-2">
                    <span className="font-bold">{title}</span>
                    <span className="rounded-md bg-mist px-2 py-0.5 text-[11px] font-semibold text-teal-dark">{badge}</span>
                  </span>
                  <span className="mt-0.5 block text-sm text-soft">{text}</span>
                </span>
                <FiChevronRight className="text-soft" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Popular equipment searches */}
      <section className="py-6" aria-labelledby="popular">
        <div className="flex items-end justify-between">
          <h2 id="popular" className="text-2xl font-bold">Popular equipment searches</h2>
          <Link to="/equipment" className="text-sm font-semibold text-teal-dark">View all</Link>
        </div>
        <ul className="mt-4 flex flex-wrap gap-2">
          {popular.map((p) => (
            <li key={p}>
              <Link
                to={`/equipment?q=${encodeURIComponent(p)}`}
                className="inline-flex min-h-11 items-center rounded-full border border-line bg-white px-4 text-sm font-medium hover:border-teal"
              >
                {p}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Privacy and safety */}
      <section className="py-6" aria-labelledby="safety">
        <div className="rounded-2xl border border-line bg-white p-5">
          <h2 id="safety" className="flex items-center gap-2 text-lg font-bold">
            <FiLock className="text-teal" aria-hidden /> Privacy and safety
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-soft">
            <li className="flex gap-2"><FiCheck className="mt-0.5 shrink-0 text-teal" aria-hidden /> We do not ask for diagnosis or other sensitive medical details.</li>
            <li className="flex gap-2"><FiCheck className="mt-0.5 shrink-0 text-teal" aria-hidden /> Qualifications are shown as supplied by the physio. Physio Sathi has not verified them.</li>
            <li className="flex gap-2"><FiCheck className="mt-0.5 shrink-0 text-teal" aria-hidden /> External equipment results come from the web and are not verified for quality, safety or seller trust.</li>
            <li className="flex gap-2"><FiCheck className="mt-0.5 shrink-0 text-teal" aria-hidden /> AI Sathi does not diagnose or prescribe. Ask a qualified physiotherapist about clinical decisions.</li>
          </ul>
        </div>
      </section>

      {/* Assistant call to action */}
      <section className="pb-10 pt-4">
        <div className="flex flex-col items-start gap-4 rounded-2xl bg-mist p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal text-white"><FiSend aria-hidden /></span>
            <div>
              <p className="font-bold">Not sure where to start?</p>
              <p className="text-sm text-soft">Describe what you need to AI Sathi in your own words. It is not medical advice.</p>
            </div>
          </div>
          <Link to="/assistant" className="inline-flex min-h-11 items-center justify-center gap-1 rounded-xl bg-navy px-5 font-semibold text-white">
            Start <FiArrowRight aria-hidden />
          </Link>
        </div>
      </section>
    </div>
  )
}
