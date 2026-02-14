"use client";

import Image from "next/image";
import {
  Fragment,
  type PointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import PaymentForm from "./components/PaymentForm";
import { StripeElementsProvider } from "./components/StripeElementsProvider";

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
    previewShots: [
      {
        src: "/weddings/eunice-260.webp",
        alt: "Soft ceremony details",
      },
      {
        src: "/weddings/eunice-246.webp",
        alt: "Golden hour portraits",
      },
      {
        src: "/weddings/eunice-211.webp",
        alt: "Vows in warm light",
      },
    ],
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
    previewShots: [
      {
        src: "/weddings/eunice-246.webp",
        alt: "Golden hour couple",
      },
      {
        src: "/weddings/groom-25.webp",
        alt: "Reception celebration",
      },
      {
        src: "/weddings/eunice-260.webp",
        alt: "Classic ceremony moment",
      },
    ],
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
    previewShots: [
      {
        src: "/weddings/groom-25.webp",
        alt: "Evening celebration",
      },
      {
        src: "/weddings/eunice-211.webp",
        alt: "Romantic vows",
      },
      {
        src: "/weddings/eunice-246.webp",
        alt: "Editorial couple portrait",
      },
    ],
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
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    null,
  );
  const [expandedIncludes, setExpandedIncludes] = useState<
    Record<string, boolean>
  >({});
  const [isDesktop, setIsDesktop] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const [formData, setFormData] = useState<
    Record<string, { fullName: string; email: string; weddingDate: string }>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentState, setPaymentState] = useState<{
    clientSecret: string;
    packageId: string;
    packageName: string;
    amount: number;
  } | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);

  const toggleIncludes = (id: string) => {
    setExpandedIncludes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelectPackage = (id: string) => {
    setSelectedPackageId((current) => (current === id ? null : id));
    setExpandedIncludes((prev) => ({ ...prev, [id]: true }));
  };

  const prepareSignatureCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    const width = parent?.clientWidth ?? 320;
    const height = 140;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#1b1915";
    ctx.fillStyle = "#fefbf7";
    ctx.fillRect(0, 0, width, height);
  };

  useEffect(() => {
    if (!selectedPackageId) return;
    prepareSignatureCanvas();
  }, [selectedPackageId]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const updateViewport = () => setIsDesktop(media.matches);

    updateViewport();
    media.addEventListener("change", updateViewport);
    return () => media.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    if (!selectedPackageId) return;
    prepareSignatureCanvas();
  }, [isDesktop, selectedPackageId]);

  const getCanvasPoint = (
    event: PointerEvent<HTMLCanvasElement>,
  ): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const handlePointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const point = getCanvasPoint(event);
    if (!canvas || !ctx || !point) return;
    isDrawingRef.current = true;
    lastPointRef.current = point;
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
  };

  const handlePointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const point = getCanvasPoint(event);
    if (!canvas || !ctx || !point || !lastPointRef.current) return;
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastPointRef.current = point;
  };

  const handlePointerEnd = () => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
  };

  const clearSignature = () => {
    prepareSignatureCanvas();
  };

  const handleStripeCheckout = async (packageId: string) => {
    setIsLoadingPayment(true);
    setPaymentError(null);
    
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId }),
      });

      if (!response.ok) {
        setPaymentError("Unable to start checkout. Please try again.");
        setIsLoadingPayment(false);
        return;
      }

      const data = (await response.json()) as {
        clientSecret?: string;
        packageId?: string;
        amount?: number;
      };

      if (!data.clientSecret || !data.packageId) {
        setPaymentError("Invalid payment response. Please try again.");
        setIsLoadingPayment(false);
        return;
      }

      const selectedPkg = packages.find((p) => p.id === packageId);
      if (!selectedPkg) {
        setPaymentError("Package not found.");
        setIsLoadingPayment(false);
        return;
      }

      setPaymentState({
        clientSecret: data.clientSecret,
        packageId: data.packageId,
        packageName: selectedPkg.name,
        amount: data.amount || 0,
      });
      setShowPaymentForm(true);
    } catch (error) {
      console.error("Checkout error:", error);
      setPaymentError("An error occurred. Please try again.");
    } finally {
      setIsLoadingPayment(false);
    }
  };

  const handleSubmitContract = async (
    packageId: string,
    packageName: string,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      alert("Signature canvas is missing.");
      return;
    }

    const form = formData[packageId];
    if (!form || !form.fullName || !form.email || !form.weddingDate) {
      alert("Please fill all fields.");
      return;
    }

    const signatureDataUrl = canvas.toDataURL("image/png");

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contract/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId,
          packageName,
          fullName: form.fullName,
          email: form.email,
          weddingDate: form.weddingDate,
          signature: signatureDataUrl,
        }),
      });

      if (!response.ok) {
        alert("Failed to submit contract. Please try again.");
        setIsSubmitting(false);
        return;
      }

      alert("Contract submitted successfully! We'll be in touch soon.");
      setFormData((prev) => ({
        ...prev,
        [packageId]: { fullName: "", email: "", weddingDate: "" },
      }));
      clearSignature();
    } catch (error) {
      console.error("Contract submission error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormField = (
    packageId: string,
    field: "fullName" | "email" | "weddingDate",
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [packageId]: {
        ...prev[packageId],
        [field]: value,
      },
    }));
  };

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
            Ever after
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

          <div className="rounded-[28px] border border-[#e6d9c8] bg-white/90 p-5 shadow-[0_24px_60px_-45px_rgba(32,24,16,0.6)]">
            <p className="text-xs uppercase tracking-[0.35em] text-[#8b7a66]">
              Full Pricing Table
            </p>
            {isDesktop ? (
              <div className="mt-4 overflow-x-auto rounded-2xl border border-[#e6d9c8]">
                <table className="w-full text-left text-[13px]">
                  <thead className="bg-[#f1e7db] text-[11px] uppercase tracking-[0.28em] text-[#6f6358]">
                    <tr>
                      <th className="px-4 py-4">Collection</th>
                      <th className="px-4 py-4">Price</th>
                      <th className="px-4 py-4">Coverage</th>
                      <th className="px-4 py-4">Includes</th>
                      <th className="px-4 py-4">Turnaround</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {packages.map((item) => {
                      const isSelected = selectedPackageId === item.id;
                      const isExpanded =
                        isSelected || !!expandedIncludes[item.id];
                      const visibleIncludes = isExpanded
                        ? item.includes
                        : item.includes.slice(0, 2);

                      return (
                        <Fragment key={item.id}>
                          <tr
                            className={`border-t border-[#efe5d8] align-top transition ${
                              isSelected ? "bg-[#fff8ef]" : "hover:bg-[#fbf8f4]"
                            }`}
                          >
                            <td className="px-4 py-4 font-semibold">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p>{item.name}</p>
                                  {item.highlight ? (
                                    <span className="mt-2 inline-flex rounded-full bg-[#1b1915] px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-[#f8f3ed]">
                                      {item.highlight}
                                    </span>
                                  ) : null}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleSelectPackage(item.id)}
                                  className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] transition ${
                                    isSelected
                                      ? "bg-[#1b1915] text-[#f8f3ed]"
                                      : "border border-[#c9b59a] text-[#6f6358] hover:border-[#1b1915] hover:text-[#1b1915]"
                                  }`}
                                >
                                  {isSelected ? "Selected" : "Select"}
                                </button>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-base font-semibold">
                              {item.price}
                            </td>
                            <td className="px-4 py-4 text-sm text-[#5c5247]">
                              <span className="block text-[11px] uppercase tracking-[0.25em] text-[#8b7a66]">
                                Coverage
                              </span>
                              {item.coverage}
                            </td>
                            <td className="px-4 py-4">
                              <ul className="space-y-2 text-[12px] text-[#5c5247]">
                                {visibleIncludes.map((detail, index) => (
                                  <li
                                    key={detail}
                                    className={`${index === 0 ? "pt-0" : "pt-2"}`}
                                  >
                                    {detail}
                                  </li>
                                ))}
                              </ul>
                              {!isSelected && item.includes.length > 2 ? (
                                <button
                                  type="button"
                                  onClick={() => toggleIncludes(item.id)}
                                  className="mt-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8b7a66] transition hover:text-[#1b1915]"
                                >
                                  {isExpanded
                                    ? "See less"
                                    : `See more (${item.includes.length - 2})`}
                                </button>
                              ) : null}
                            </td>
                            <td className="px-4 py-4 text-sm text-[#5c5247]">
                              <span className="block text-[11px] uppercase tracking-[0.25em] text-[#8b7a66]">
                                Turnaround
                              </span>
                              {item.turnaround}
                            </td>
                          </tr>
                          {isSelected ? (
                            <tr className="border-t border-[#efe5d8] bg-[#fffdf9]">
                              <td colSpan={5} className="px-4 py-5">
                                <div className="grid gap-6 rounded-2xl border border-[#e6d9c8] bg-white p-5 md:grid-cols-[1.05fr_0.95fr]">
                                  <div className="space-y-4">
                                    <div>
                                      <p className="text-xs uppercase tracking-[0.35em] text-[#8b7a66]">
                                        {item.name} preview
                                      </p>
                                      <p className="text-sm text-[#6f6358]">
                                        Full collection details and editing
                                        style preview.
                                      </p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                      {item.previewShots.map((shot) => (
                                        <div
                                          key={shot.src}
                                          className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-[#e6d9c8]"
                                        >
                                          <Image
                                            src={shot.src}
                                            alt={shot.alt}
                                            fill
                                            sizes="(max-width: 1024px) 20vw, 150px"
                                            className="object-cover"
                                          />
                                        </div>
                                      ))}
                                    </div>
                                    <div>
                                      <p className="text-xs uppercase tracking-[0.35em] text-[#8b7a66]">
                                        Includes (full list)
                                      </p>
                                      <ul className="mt-3 space-y-2 text-[12px] text-[#5c5247]">
                                        {item.includes.map((detail) => (
                                          <li key={detail}>{detail}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                  <div className="rounded-2xl border border-[#e6d9c8] bg-[#fffdf9] p-4">
                                    <p className="text-xs uppercase tracking-[0.35em] text-[#8b7a66]">
                                      Quick contract
                                    </p>
                                    <p className="mt-2 text-sm text-[#6f6358]">
                                      Reserve the {item.name} collection by
                                      filling the details and adding your
                                      signature.
                                    </p>
                                    <p className="mt-2 text-xs text-[#8b7a66]">
                                      A 20% retainer reserves your date.
                                    </p>
                                    <div className="mt-4 grid gap-3">
                                      <input
                                        className="w-full rounded-full border border-[#dac9b0] bg-transparent px-4 py-2 text-sm text-[#1b1915] focus:border-[#1b1915] focus:outline-none"
                                        placeholder="Full name"
                                        type="text"
                                        autoComplete="name"
                                        value={
                                          formData[item.id]?.fullName ?? ""
                                        }
                                        onChange={(e) =>
                                          updateFormField(
                                            item.id,
                                            "fullName",
                                            e.target.value,
                                          )
                                        }
                                      />
                                      <input
                                        className="w-full rounded-full border border-[#dac9b0] bg-transparent px-4 py-2 text-sm text-[#1b1915] focus:border-[#1b1915] focus:outline-none"
                                        placeholder="Email"
                                        type="email"
                                        autoComplete="email"
                                        value={formData[item.id]?.email ?? ""}
                                        onChange={(e) =>
                                          updateFormField(
                                            item.id,
                                            "email",
                                            e.target.value,
                                          )
                                        }
                                      />
                                      <input
                                        className="w-full rounded-full border border-[#dac9b0] bg-transparent px-4 py-2 text-sm text-[#1b1915] focus:border-[#1b1915] focus:outline-none"
                                        placeholder="Wedding date"
                                        type="text"
                                        inputMode="numeric"
                                        value={
                                          formData[item.id]?.weddingDate ?? ""
                                        }
                                        onChange={(e) =>
                                          updateFormField(
                                            item.id,
                                            "weddingDate",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </div>
                                    <div className="mt-4">
                                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-[#8b7a66]">
                                        <span>Signature</span>
                                        <button
                                          type="button"
                                          onClick={clearSignature}
                                          className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8b7a66] transition hover:text-[#1b1915]"
                                        >
                                          Clear
                                        </button>
                                      </div>
                                      <div className="mt-2 rounded-2xl border border-dashed border-[#d8c8b1] bg-[#fefbf7] p-2">
                                        <canvas
                                          ref={canvasRef}
                                          className="h-[140px] w-full touch-none rounded-xl"
                                          onPointerDown={handlePointerDown}
                                          onPointerMove={handlePointerMove}
                                          onPointerUp={handlePointerEnd}
                                          onPointerLeave={handlePointerEnd}
                                        />
                                      </div>
                                      <p className="mt-3 text-xs text-[#8b7a66]">
                                        By signing, you acknowledge the booking
                                        terms and reserve the date once
                                        availability is confirmed.
                                      </p>
                                    </div>
                                    <div className="mt-4 grid gap-3">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleSubmitContract(
                                            item.id,
                                            item.name,
                                          )
                                        }
                                        disabled={isSubmitting}
                                        className="w-full rounded-full bg-[#6f6358] px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#f8f3ed] transition hover:-translate-y-0.5 hover:bg-[#5c5247] disabled:opacity-50"
                                      >
                                        {isSubmitting
                                          ? "Submitting..."
                                          : "Submit (Manual payment)"}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleStripeCheckout(item.id)
                                        }
                                        disabled={isLoadingPayment}
                                        className="w-full rounded-full bg-[#1b1915] px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#f8f3ed] transition hover:-translate-y-0.5 hover:bg-[#2b2620] disabled:opacity-50"
                                      >
                                        {isLoadingPayment
                                          ? "Loading..."
                                          : "Pay 20% Retainer"}
                                      </button>
                                    </div>
                                    <p className="mt-3 text-xs text-[#8b7a66]">
                                      Manual options also accepted: Zelle, cash,
                                      or check.
                                    </p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ) : null}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : null}
            {!isDesktop ? (
              <div className="mt-4 grid gap-4">
                {packages.map((item) => {
                  const isSelected = selectedPackageId === item.id;
                  const isExpanded = isSelected || !!expandedIncludes[item.id];
                  const visibleIncludes = isExpanded
                    ? item.includes
                    : item.includes.slice(0, 2);

                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl border p-4 shadow-[0_16px_40px_-30px_rgba(32,24,16,0.6)] transition ${
                        isSelected
                          ? "border-[#1b1915] bg-[#fff8ef]"
                          : "border-[#e6d9c8] bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[#1b1915]">
                            {item.name}
                          </p>
                          {item.highlight ? (
                            <span className="mt-2 inline-flex rounded-full bg-[#1b1915] px-2 py-1 text-[10px] uppercase tracking-[0.25em] text-[#f8f3ed]">
                              {item.highlight}
                            </span>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSelectPackage(item.id)}
                          className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] transition ${
                            isSelected
                              ? "bg-[#1b1915] text-[#f8f3ed]"
                              : "border border-[#c9b59a] text-[#6f6358]"
                          }`}
                        >
                          {isSelected ? "Selected" : "Select"}
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-xl font-semibold text-[#1b1915]">
                          {item.price}
                        </p>
                        <div className="text-right text-xs text-[#6f6358]">
                          <p className="uppercase tracking-[0.25em] text-[#8b7a66]">
                            Coverage
                          </p>
                          <p>{item.coverage}</p>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-[#6f6358]">
                        <p className="uppercase tracking-[0.25em] text-[#8b7a66]">
                          Turnaround
                        </p>
                        <p>{item.turnaround}</p>
                      </div>
                      <div className="mt-4">
                        <p className="text-[11px] uppercase tracking-[0.25em] text-[#8b7a66]">
                          Includes
                        </p>
                        <ul className="mt-2 space-y-2 text-[12px] text-[#5c5247]">
                          {visibleIncludes.map((detail) => (
                            <li key={detail}>{detail}</li>
                          ))}
                        </ul>
                        {!isSelected && item.includes.length > 2 ? (
                          <button
                            type="button"
                            onClick={() => toggleIncludes(item.id)}
                            className="mt-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8b7a66]"
                          >
                            {isExpanded
                              ? "See less"
                              : `See more (${item.includes.length - 2})`}
                          </button>
                        ) : null}
                      </div>
                      {isSelected ? (
                        <div className="mt-5 space-y-4 rounded-2xl border border-[#e6d9c8] bg-[#fffdf9] p-4">
                          <div>
                            <p className="text-xs uppercase tracking-[0.35em] text-[#8b7a66]">
                              {item.name} preview
                            </p>
                            <div className="mt-3 grid grid-cols-3 gap-2">
                              {item.previewShots.map((shot) => (
                                <div
                                  key={shot.src}
                                  className="relative aspect-[3/4] overflow-hidden rounded-xl border border-[#e6d9c8]"
                                >
                                  <Image
                                    src={shot.src}
                                    alt={shot.alt}
                                    fill
                                    sizes="(max-width: 768px) 30vw, 140px"
                                    className="object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-[0.35em] text-[#8b7a66]">
                              Includes (full list)
                            </p>
                            <ul className="mt-2 space-y-2 text-[12px] text-[#5c5247]">
                              {item.includes.map((detail) => (
                                <li key={detail}>{detail}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="rounded-2xl border border-[#e6d9c8] bg-white p-4">
                            <p className="text-xs uppercase tracking-[0.35em] text-[#8b7a66]">
                              Quick contract
                            </p>
                            <p className="mt-2 text-sm text-[#6f6358]">
                              Reserve the {item.name} collection by filling the
                              details and adding your signature.
                            </p>
                            <p className="mt-2 text-xs text-[#8b7a66]">
                              A 20% retainer reserves your date.
                            </p>
                            <div className="mt-4 grid gap-3">
                              <input
                                className="w-full rounded-full border border-[#dac9b0] bg-transparent px-4 py-2 text-sm text-[#1b1915] focus:border-[#1b1915] focus:outline-none"
                                placeholder="Full name"
                                type="text"
                                autoComplete="name"
                                value={formData[item.id]?.fullName ?? ""}
                                onChange={(e) =>
                                  updateFormField(
                                    item.id,
                                    "fullName",
                                    e.target.value,
                                  )
                                }
                              />
                              <input
                                className="w-full rounded-full border border-[#dac9b0] bg-transparent px-4 py-2 text-sm text-[#1b1915] focus:border-[#1b1915] focus:outline-none"
                                placeholder="Email"
                                type="email"
                                autoComplete="email"
                                value={formData[item.id]?.email ?? ""}
                                onChange={(e) =>
                                  updateFormField(
                                    item.id,
                                    "email",
                                    e.target.value,
                                  )
                                }
                              />
                              <input
                                className="w-full rounded-full border border-[#dac9b0] bg-transparent px-4 py-2 text-sm text-[#1b1915] focus:border-[#1b1915] focus:outline-none"
                                placeholder="Wedding date"
                                type="text"
                                inputMode="numeric"
                                value={formData[item.id]?.weddingDate ?? ""}
                                onChange={(e) =>
                                  updateFormField(
                                    item.id,
                                    "weddingDate",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                            <div className="mt-4">
                              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-[#8b7a66]">
                                <span>Signature</span>
                                <button
                                  type="button"
                                  onClick={clearSignature}
                                  className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8b7a66] transition hover:text-[#1b1915]"
                                >
                                  Clear
                                </button>
                              </div>
                              <div className="mt-2 rounded-2xl border border-dashed border-[#d8c8b1] bg-[#fefbf7] p-2">
                                <canvas
                                  ref={canvasRef}
                                  className="h-[140px] w-full touch-none rounded-xl"
                                  onPointerDown={handlePointerDown}
                                  onPointerMove={handlePointerMove}
                                  onPointerUp={handlePointerEnd}
                                  onPointerLeave={handlePointerEnd}
                                />
                              </div>
                              <p className="mt-3 text-xs text-[#8b7a66]">
                                By signing, you acknowledge the booking terms
                                and reserve the date once availability is
                                confirmed.
                              </p>
                            </div>
                            <div className="mt-4 grid gap-3">
                              <button
                                type="button"
                                onClick={() =>
                                  handleSubmitContract(item.id, item.name)
                                }
                                disabled={isSubmitting}
                                className="w-full rounded-full bg-[#6f6358] px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#f8f3ed] disabled:opacity-50"
                              >
                                {isSubmitting
                                  ? "Submitting..."
                                  : "Submit (Manual payment)"}
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleStripeCheckout(item.id)
                                }
                                disabled={isLoadingPayment}
                                className="w-full rounded-full bg-[#1b1915] px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#f8f3ed] disabled:opacity-50"
                              >
                                {isLoadingPayment
                                  ? "Loading..."
                                  : "Pay 20% Retainer"}
                              </button>
                            </div>
                            <p className="mt-3 text-xs text-[#8b7a66]">
                              Manual options also accepted: Zelle, cash, or
                              check.
                            </p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : null}
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

      {/* Payment Modal */}
      {showPaymentForm && paymentState && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#1b1915]">
                Complete Payment
              </h2>
              <button
                onClick={() => {
                  setShowPaymentForm(false);
                  setPaymentState(null);
                  setPaymentError(null);
                }}
                className="text-2xl text-[#8b7a66] transition hover:text-[#1b1915]"
              >
                ×
              </button>
            </div>

            {paymentError && (
              <div className="mb-4 rounded-lg bg-red-50 p-3">
                <p className="text-sm text-red-700">{paymentError}</p>
              </div>
            )}

            <StripeElementsProvider>
              <div key={paymentState.clientSecret}>
                <PaymentForm
                  clientSecret={paymentState.clientSecret}
                  amount={paymentState.amount}
                  packageName={paymentState.packageName}
                  onSuccess={() => {
                    setShowPaymentForm(false);
                    setPaymentState(null);
                  }}
                  onCancel={() => {
                    setShowPaymentForm(false);
                    setPaymentState(null);
                    setPaymentError(null);
                  }}
                />
              </div>
            </StripeElementsProvider>
          </div>
        </div>
      )}
    </div>
  );
}
