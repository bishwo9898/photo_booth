"use client";

import Image from "next/image";
import { useState } from "react";

const heroShots = [
  {
    src: "/weddings/eunice-260.webp",
    alt: "Wedding ceremony portrait",
    label: "Ceremony",
  },
  {
    src: "/weddings/eunice-246.webp",
    alt: "Wedding couple golden hour",
    label: "Golden Hour",
  },
  {
    src: "/weddings/groom-25.webp",
    alt: "Wedding reception celebration",
    label: "Reception",
  },
  {
    src: "/weddings/eunice-211.webp",
    alt: "Wedding vows in warm light",
    label: "Vows",
  },
];

const packages = [
  {
    id: "essential",
    name: "Essential",
    price: "$1,800",
    coverage: "4 hours",
    turnaround: "5–7 weeks",
    highlight: null,
    includes: [
      "4 hours of wedding day coverage",
      "Guided posing, while capturing your candid moments",
      "Private online gallery for easy sharing and downloads",
      "250+ carefully edited images in my signature style",
      "Sneak peeks within 3 days",
      "Full gallery delivered in 5–7 weeks",
      "Whether you want an elegant, modern vibe or something timeless and romantic, I craft the look with professional equipment and a trained eye for lighting, ensuring your day’s atmosphere shines exactly how you envision it.",
    ],
  },
  {
    id: "signature",
    name: "Signature",
    price: "$2,600",
    coverage: "8 hours",
    turnaround: "5–7 weeks",
    highlight: "Most Booked",
    includes: [
      "8 hours of coverage capturing your entire day, from getting ready to the evening magic",
      "Personalized timeline and pre-wedding consultation so every key moment is planned",
      "~400+ carefully edited images with a timeless, refined style",
      "Sneak peeks within 3 days",
      "Full gallery delivered in 5–7 weeks",
      "Includes a 2-minute cinematic highlight video—a film that complements your photos, capturing the emotion in motion",
    ],
  },
  {
    id: "luxury",
    name: "Luxury",
    price: "$3,400",
    coverage: "24 hours",
    turnaround: "5–7 weeks",
    highlight: null,
    includes: [
      "Full-day wedding coverage, from your morning moments to your final celebration",
      "Personalized timeline planning and a pre-wedding consultation",
      "A complimentary 1-hour pre-wedding session with two outfits to celebrate your journey",
      "Private online gallery for easy sharing",
      "~600+ carefully edited images, telling your full story",
      "Sneak peeks within 48 hours",
      "Full gallery delivered in 5–7 weeks",
      "A 2-minute cinematic highlight video, blending motion and emotion seamlessly",
    ],
  },
];

const bookingTerms = [
  {
    item: "Wedding retainer",
    policy: "30% to reserve the date (non-refundable)",
  },
  {
    item: "Balance due",
    policy: "14 days before wedding",
  },
  {
    item: "Engagement booking",
    policy: "$100 deposit to reserve date (or pay in full)",
  },
  {
    item: "Delivery",
    policy: "Online gallery with downloads",
  },
];

const processSteps = [
  {
    step: "1) Inquiry",
    happens: "You send date + venue + what you’re looking for",
    get: "I confirm availability + send exact options",
  },
  {
    step: "2) Planning",
    happens: "Quick call + timeline guidance + shot priorities",
    get: "Clear plan, no stress, no guessing",
  },
  {
    step: "3) Session / Wedding Day",
    happens: "Posing direction + guided moments + candid coverage",
    get: "You look natural, confident, and elevated",
  },
  {
    step: "4) Editing",
    happens: "Culling + color + retouching (consistent style)",
    get: "Sneak peeks fast, full gallery after",
  },
  {
    step: "5) Delivery",
    happens: "Private online gallery + easy download + sharing",
    get: "Final images ready for prints + socials",
  },
];

export default function Home() {
  const [activeShot, setActiveShot] = useState(heroShots[0]);
  const [activePackageId, setActivePackageId] = useState(packages[1].id);
  const activePackage = packages.find((item) => item.id === activePackageId);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f4f1] text-[#161410]">
      <div className="pointer-events-none absolute inset-0">
        <div className="grain-overlay absolute inset-0" />
        <div className="absolute -left-32 top-12 h-72 w-72 rounded-full bg-[#e7d7c2]/70 blur-3xl float-slow" />
        <div className="absolute right-[-140px] top-48 h-80 w-80 rounded-full bg-[#d0b48b]/40 blur-3xl float-medium" />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-6 px-6 py-10">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.35em] text-[#8b7a66]">
            Wedding Photography
          </p>
          <h1
            className="text-2xl font-semibold tracking-tight text-[#1b1915]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Shutter Unit
          </h1>
        </div>
        <nav className="flex flex-wrap items-center gap-6 text-xs font-semibold uppercase tracking-[0.3em] text-[#6f6358]">
          <a className="transition hover:text-[#1b1915]" href="#pricing">
            Pricing
          </a>
          <a className="transition hover:text-[#1b1915]" href="#terms">
            Booking Terms
          </a>
          <a className="transition hover:text-[#1b1915]" href="#process">
            Process
          </a>
          <a className="transition hover:text-[#1b1915]" href="#contact">
            Contact
          </a>
        </nav>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-24">
        <section className="grid gap-10 pb-20 pt-2 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.35em] text-[#8b7a66]">
              Wedding collections & experience
            </p>
            <h2
              className="text-4xl font-semibold leading-tight text-[#161410] sm:text-5xl"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Pricing crafted like a magazine spread—clean, clear, and designed
              for modern weddings.
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-[#5c5247]">
              Scroll for a full pricing table, booking terms, and a transparent
              step-by-step process. Every collection is shaped around your
              story, with refined editing and a calm, guided experience.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                className="inline-flex items-center justify-center rounded-full bg-[#1b1915] px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#f8f3ed] transition hover:-translate-y-0.5 hover:bg-[#2b2620]"
                href="#pricing"
              >
                View pricing
              </a>
              <a
                className="inline-flex items-center justify-center rounded-full border border-[#bda88b] px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#5c5247] transition hover:-translate-y-0.5 hover:border-[#1b1915] hover:text-[#1b1915]"
                href="https://shutterunit.com/contact"
                target="_blank"
                rel="noopener noreferrer"
              >
                Inquire now
              </a>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="relative overflow-hidden rounded-[28px] border border-[#e6d9c8] bg-[#1d1710] shadow-[0_35px_80px_-50px_rgba(32,24,16,0.8)]">
              <div className="relative aspect-[4/5]">
                <Image
                  src={activeShot.src}
                  alt={activeShot.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 520px"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a140c]/70 via-transparent to-transparent" />
              </div>
              <div className="absolute bottom-6 left-6 z-10 space-y-1 text-[#f9f4ee]">
                <p className="text-xs uppercase tracking-[0.4em]">Featured</p>
                <p
                  className="text-lg font-semibold"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {activeShot.label}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {heroShots.map((shot) => (
                <button
                  key={shot.label}
                  type="button"
                  onClick={() => setActiveShot(shot)}
                  className={`relative h-24 overflow-hidden rounded-2xl border transition ${
                    activeShot.label === shot.label
                      ? "border-[#1b1915] shadow-[0_18px_35px_-24px_rgba(32,24,16,0.7)]"
                      : "border-[#e2d6c6] opacity-80 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    sizes="(max-width: 768px) 40vw, 140px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="pb-16">
          <div className="mb-8 space-y-3">
            <p className="text-xs uppercase tracking-[0.35em] text-[#8b7a66]">
              Pricing Table (Weddings)
            </p>
            <h3
              className="text-3xl font-semibold text-[#1b1915]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Collections crafted for every celebration.
            </h3>
            <p className="max-w-2xl text-sm text-[#6f6358]">
              Choose a collection, then see the full deliverables below. The
              interactive spotlight lets you preview what’s included at a
              glance.
            </p>
          </div>

          <div className="rounded-[32px] border border-[#e6d9c8] bg-white/90 p-6 shadow-[0_30px_70px_-45px_rgba(32,24,16,0.65)]">
            <p className="text-xs uppercase tracking-[0.35em] text-[#8b7a66]">
              Full Pricing Table
            </p>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-[#e6d9c8]">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#f1e7db] text-xs uppercase tracking-[0.25em] text-[#6f6358]">
                  <tr>
                    <th className="px-5 py-4">Collection</th>
                    <th className="px-5 py-4">Price</th>
                    <th className="px-5 py-4">Coverage</th>
                    <th className="px-5 py-4">Includes</th>
                    <th className="px-5 py-4">Turnaround</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {packages.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-[#efe5d8] align-top transition hover:bg-[#fbf8f4]"
                    >
                      <td className="px-5 py-5 font-semibold">
                        {item.name}
                        {item.highlight ? (
                          <span className="mt-2 inline-flex rounded-full bg-[#1b1915] px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-[#f8f3ed]">
                            {item.highlight}
                          </span>
                        ) : null}
                      </td>
                      <td className="px-5 py-5 text-lg font-semibold">
                        {item.price}
                      </td>
                      <td className="px-5 py-5 text-sm text-[#5c5247]">
                        <span className="block text-xs uppercase tracking-[0.2em] text-[#8b7a66]">
                          Coverage
                        </span>
                        {item.coverage}
                      </td>
                      <td className="px-5 py-5">
                        <ul className="space-y-2 text-xs text-[#5c5247] divide-y divide-[#efe5d8]">
                          {item.includes.map((detail, index) => (
                            <li
                              key={detail}
                              className={`${index === 0 ? "pt-0" : "pt-2"}`}
                            >
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-5 py-5 text-sm text-[#5c5247]">
                        <span className="block text-xs uppercase tracking-[0.2em] text-[#8b7a66]">
                          Turnaround
                        </span>
                        {item.turnaround}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div
            id="terms"
            className="mt-8 rounded-[24px] border border-[#e6d9c8] bg-[#1b1915] p-8 text-[#f8f3ed]"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-[#d5c0a0]">
              Booking & Payment (Short Terms)
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-[220px_1fr]">
              <div className="rounded-2xl border border-[#3a2f24] bg-[#241f1a] p-4 text-sm text-[#d8cbbd]">
                Simple, clear policies designed to reserve your date and keep
                planning easy.
              </div>
              <div className="overflow-x-auto rounded-2xl border border-[#3a2f24] bg-[#241f1a]">
                <table className="w-full text-sm">
                  <thead className="bg-[#2e261d] text-xs uppercase tracking-[0.2em] text-[#d8cbbd]">
                    <tr>
                      <th className="px-4 py-3">Item</th>
                      <th className="px-4 py-3">Policy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingTerms.map((term) => (
                      <tr key={term.item} className="border-t border-[#3a2f24]">
                        <td className="px-4 py-3 font-semibold text-[#f8f3ed]">
                          {term.item}
                        </td>
                        <td className="px-4 py-3 text-[#d8cbbd]">
                          {term.policy}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="mt-5 text-sm text-[#d8cbbd]">
              “Want a beautifully crafted keepsake? A custom-designed photo
              album is available for $200. I’ll work with you to ensure your
              favorite moments are curated and printed in a high-quality,
              timeless album. Just let me know if you’d like to add it when we
              book your session!”
            </p>
          </div>
        </section>

        <section id="process" className="pb-20">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.35em] text-[#8b7a66]">
              Process Table
            </p>
            <h3
              className="text-3xl font-semibold text-[#1b1915]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              What it’s like working with me
            </h3>
          </div>
          <div className="overflow-x-auto rounded-[28px] border border-[#e6d9c8] bg-white/80">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#f1e7db] text-xs uppercase tracking-[0.2em] text-[#6f6358]">
                <tr>
                  <th className="px-4 py-4">Step</th>
                  <th className="px-4 py-4">What Happens</th>
                  <th className="px-4 py-4">What You Get</th>
                </tr>
              </thead>
              <tbody>
                {processSteps.map((step) => (
                  <tr
                    key={step.step}
                    className="border-t border-[#efe5d8] transition hover:bg-[#fbf8f4]"
                  >
                    <td className="px-4 py-4 font-semibold">{step.step}</td>
                    <td className="px-4 py-4 text-[#5c5247]">{step.happens}</td>
                    <td className="px-4 py-4 text-[#5c5247]">{step.get}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="contact" className="pb-24">
          <div className="grid gap-8 rounded-[32px] border border-[#e6d9c8] bg-[#fbf8f4] p-10 md:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.35em] text-[#8b7a66]">
                Ready to reserve?
              </p>
              <h3
                className="text-3xl font-semibold text-[#1b1915]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Let’s craft an effortless wedding experience.
              </h3>
              <p className="text-sm leading-relaxed text-[#6f6358]">
                Share your wedding date, venue, and vision. I’ll respond with a
                custom plan, timeline tips, and the best collection for your
                celebration.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <a
                className="inline-flex items-center justify-center rounded-full bg-[#1b1915] px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#f8f3ed] transition hover:-translate-y-0.5 hover:bg-[#2b2620]"
                href="https://shutterunit.com/contact"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact shutterunit.com
              </a>
              <a
                className="inline-flex items-center justify-center rounded-full border border-[#bda88b] px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#5c5247] transition hover:-translate-y-0.5 hover:border-[#1b1915] hover:text-[#1b1915]"
                href="https://shutterunit.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore full portfolio
              </a>
              <p className="text-xs text-[#8b7a66]">
                Prefer scanning? Visit shutterunit.com on your phone for the
                full booking flow.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-[#e6d9c8]">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-4 px-6 py-8 text-sm text-[#7d7166] md:flex-row md:items-center">
          <p>© 2026 Shutter Unit. Crafted for weddings.</p>
          <div className="flex gap-6">
            <a
              className="transition hover:text-[#1b1915]"
              href="https://shutterunit.com"
            >
              shutterunit.com
            </a>
            <a
              className="transition hover:text-[#1b1915]"
              href="https://shutterunit.com/contact"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
