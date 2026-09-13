import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import "./ChannelPartnerLanding.css";
import {
  Building2,
  TrendingUp,
  ShieldCheck,
  Users,
  Award,
  FileText,
  CheckCircle2,
  Calculator,
  ChevronDown,
  PhoneCall,
  ArrowRight,
  Briefcase,
  Clock,
  Sparkles,
  Star,
  Menu,
  X,
  MapPin,
  Percent,
  Layers
} from "lucide-react";
import { toast } from "react-toastify";

const ChannelPartnerLanding = () => {
  const navigate = useNavigate();

  // Mobile navigation state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Interactive Calculator State
  const [ticketSize, setTicketSize] = useState(2.5); // In ₹ Crores
  const [monthlyDeals, setMonthlyDeals] = useState(2); // Units per month
  const [commissionRate, setCommissionRate] = useState(2.5); // Percentage

  // FAQ Accordion State
  const [activeFaq, setActiveFaq] = useState(0);

  // Express Callback Modal State
  const [showModal, setShowModal] = useState(false);
  const [callbackForm, setCallbackForm] = useState({
    name: "",
    phone: "",
    city: "Delhi NCR",
    notes: ""
  });
  const [submittingCallback, setSubmittingCallback] = useState(false);

  // Calculations
  const dealValueCr = ticketSize * monthlyDeals;
  const monthlyEarningsLakhs = (dealValueCr * 100 * (commissionRate / 100)).toFixed(2);
  const annualEarningsLakhs = (monthlyEarningsLakhs * 12).toFixed(1);

  const formatCurrency = (lakhs) => {
    const val = parseFloat(lakhs);
    if (val >= 100) {
      return `₹${(val / 100).toFixed(2)} Cr`;
    }
    return `₹${val.toFixed(1)} Lakhs`;
  };

  const handleCallbackSubmit = (e) => {
    e.preventDefault();
    if (!callbackForm.name.trim() || !callbackForm.phone.trim()) {
      toast.error("Please provide your name and contact number.");
      return;
    }
    if (!/^\d{10}$/.test(callbackForm.phone.trim())) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    setSubmittingCallback(true);
    setTimeout(() => {
      setSubmittingCallback(false);
      setShowModal(false);
      toast.success("Callback request received! Our Partner Desk will contact you within 2 business hours.");
      setCallbackForm({ name: "", phone: "", city: "Delhi NCR", notes: "" });
    }, 800);
  };

  // Sample Mandate Projects
  const mandateProjects = [
    {
      id: 1,
      name: "The Grand Sapphire Residences",
      location: "Golf Course Ext. Road, Gurgaon",
      type: "Ultra-Luxury 3 & 4 BHK",
      price: "₹3.85 Cr - ₹7.20 Cr",
      commission: "Up to 3.5%",
      badge: "Exclusive Mandate",
      bgGradient: "linear-gradient(135deg, #1e3a8a, #0f172a)",
      inventory: "124 Units Open"
    },
    {
      id: 2,
      name: "Cyber Heights Commercial Plaza",
      location: "Noida Expressway, Sector 132",
      type: "Grade-A Retail & Smart Offices",
      price: "₹1.40 Cr - ₹4.50 Cr",
      commission: "Up to 4.0%",
      badge: "High ROI Retail",
      bgGradient: "linear-gradient(135deg, #065f46, #0f172a)",
      inventory: "48 Showrooms Left"
    },
    {
      id: 3,
      name: "Palm Meadows Signature Villas",
      location: "Whitefield corridor, Bangalore",
      type: "Independent Luxury Villas",
      price: "₹4.50 Cr - ₹9.80 Cr",
      commission: "Up to 3.0%",
      badge: "Ready Mandate",
      bgGradient: "linear-gradient(135deg, #701a75, #0f172a)",
      inventory: "18 Exclusive Units"
    }
  ];

  // FAQs Data
  const faqs = [
    {
      q: "Is RERA registration mandatory to join the Channel Partner network?",
      a: "Yes. In compliance with real estate regulatory standards, a valid RERA registration number and certificate are required during onboarding. This ensures transparent, legally protected business transactions and seamless developer payouts."
    },
    {
      q: "What is the typical payout cycle for commissions?",
      a: "We practice an accelerated payout policy. As soon as the client booking token and agreement to sale are processed with the developer, milestone commission advances are disbursed directly to your bank within 7 to 14 working days."
    },
    {
      q: "How are my client leads protected from poaching or internal clash?",
      a: "Every lead you register is timestamped and cryptographically locked to your channel partner ID in our CRM for 90 to 180 days. No other broker or internal agent can claim that buyer while your registration is active."
    },
    {
      q: "Will I get dedicated on-ground support for client site visits?",
      a: "Yes! Every verified partner is assigned a dedicated Relationship Manager (RM). Your RM assists with scheduling luxury site visits, providing developer-backed marketing kits, and handling negotiations at the closing table."
    },
    {
      q: "Can individual real estate brokers or smaller teams apply?",
      a: "Absolutely! Whether you are an independent property consultant, a boutique firm, or an enterprise real estate brokerage with 50+ agents, our partner tier accommodates your scale with tailored collateral and rewards."
    },
    {
      q: "How long does verification take after submitting the registration form?",
      a: "Our compliance desk reviews PAN, RERA, and business details within 24 to 48 business hours. Once verified, your CRM credentials and mandate access will be automatically dispatched via email."
    }
  ];

  return (
    <div className="cp-landing-page">
      {/* 1. STICKY MODERN NAVIGATION */}
      <header className="cp-navbar">
        <div className="container d-flex justify-content-between align-items-center">
          <Link to="/channel-partner" className="cp-nav-brand">
            <img
              src={assets.fcp_logo}
              alt="Channel Partner Network Logo"
              height={46}
              style={{ objectFit: "contain" }}
            />
            <span className="cp-brand-tag">Partner Portal</span>
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="cp-nav-links">
            <li>
              <a href="#why-us">Why Partner</a>
            </li>
            <li>
              <a href="#calculator">Earnings Calculator</a>
            </li>
            <li>
              <a href="#how-it-works">How It Works</a>
            </li>
            <li>
              <a href="#mandates">Mandate Inventory</a>
            </li>
            <li>
              <a href="#faqs">FAQs</a>
            </li>
          </ul>

          {/* Desktop Nav Actions */}
          <div className="cp-nav-actions">
            <Link to="/login" className="btn-nav-login">
              Partner Login
            </Link>
            <Link to="/register-cp" className="btn-nav-register">
              <Sparkles size={16} /> Register Now
            </Link>
            <button
              className="cp-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="cp-mobile-menu-open">
            <a href="#why-us" onClick={() => setMobileMenuOpen(false)}>Why Partner</a>
            <a href="#calculator" onClick={() => setMobileMenuOpen(false)}>Earnings Calculator</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <a href="#mandates" onClick={() => setMobileMenuOpen(false)}>Mandate Inventory</a>
            <a href="#faqs" onClick={() => setMobileMenuOpen(false)}>FAQs</a>
            <div className="d-flex flex-column gap-2 pt-2 border-top">
              <Link to="/login" className="btn-nav-login text-center">Partner Login</Link>
              <Link to="/register-cp" className="btn-nav-register text-center justify-content-center">
                Register as Channel Partner
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section className="cp-hero-section">
        <div className="container position-relative">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <div className="cp-badge-pill">
                <Sparkles size={14} /> India's Premier Real Estate Mandate Network
              </div>
              <h1 className="cp-hero-title">
                Supercharge Your Brokerage with{" "}
                <span className="text-gradient-cyan">Exclusive Mandates</span> & High Commissions
              </h1>
              <p className="cp-hero-subtitle">
                Partner directly with India's top real estate developers. Unlock verified high-ticket
                inventory, dedicated Relationship Managers, 100% lead protection, and guaranteed
                on-time payouts directly into your bank.
              </p>

              <div className="cp-hero-cta-group">
                <Link to="/register-cp" className="btn-hero-primary">
                  Register as Channel Partner <ArrowRight size={18} />
                </Link>
                <a href="#calculator" className="btn-hero-secondary">
                  <Calculator size={18} /> Calculate Earnings
                </a>
              </div>

              {/* Trust Metric Counters */}
              <div className="cp-hero-metrics">
                <div className="cp-metric-item">
                  <h4>₹850+ Cr</h4>
                  <p>Transaction Value</p>
                </div>
                <div className="cp-metric-item">
                  <h4>1,200+</h4>
                  <p>Verified Brokers</p>
                </div>
                <div className="cp-metric-item">
                  <h4>48 Hrs</h4>
                  <p>Fast-Track Approval</p>
                </div>
                <div className="cp-metric-item">
                  <h4>100%</h4>
                  <p>On-Time Payouts</p>
                </div>
              </div>
            </div>

            {/* Hero Visual Mockup */}
            <div className="col-lg-5">
              <div className="cp-hero-mockup-wrapper">
                <div className="cp-hero-card">
                  <div className="cp-mockup-header">
                    <div className="cp-mockup-dots">
                      <span className="cp-dot red"></span>
                      <span className="cp-dot yellow"></span>
                      <span className="cp-dot green"></span>
                    </div>
                    <div className="cp-mockup-badge">
                      <CheckCircle2 size={13} /> Verified CP Portal
                    </div>
                  </div>

                  <div className="cp-mockup-stat-grid">
                    <div className="cp-mockup-stat">
                      <span>Total Payout Disbursed</span>
                      <strong>₹28.4 Lakhs</strong>
                    </div>
                    <div className="cp-mockup-stat">
                      <span>Active Mandates</span>
                      <strong>14 Projects</strong>
                    </div>
                  </div>

                  <div className="cp-mockup-item">
                    <div className="cp-mockup-item-left">
                      <div className="cp-mockup-icon">
                        <Building2 size={20} />
                      </div>
                      <div className="cp-mockup-item-info">
                        <h6>The Grand Sapphire</h6>
                        <p>Unit 1402 • Token Cleared</p>
                      </div>
                    </div>
                    <span className="cp-mockup-tag">3.5% Payout</span>
                  </div>

                  <div className="cp-mockup-item">
                    <div className="cp-mockup-item-left">
                      <div className="cp-mockup-icon" style={{ background: "linear-gradient(135deg, #059669, #10B981)" }}>
                        <TrendingUp size={20} />
                      </div>
                      <div className="cp-mockup-item-info">
                        <h6>Cyber Heights Plaza</h6>
                        <p>Retail Bay 04 • Agreement Ready</p>
                      </div>
                    </div>
                    <span className="cp-mockup-tag">4.0% Payout</span>
                  </div>

                  <div className="cp-mockup-item" style={{ marginBottom: 0 }}>
                    <div className="cp-mockup-item-left">
                      <div className="cp-mockup-icon" style={{ background: "linear-gradient(135deg, #7C3AED, #8B5CF6)" }}>
                        <ShieldCheck size={20} />
                      </div>
                      <div className="cp-mockup-item-info">
                        <h6>Lead Lock Active</h6>
                        <p>Mr. Sharma • 90 Days Protected</p>
                      </div>
                    </div>
                    <span className="badge bg-success small">Protected</span>
                  </div>
                </div>

                {/* Floating Social Proof Badge */}
                <div className="cp-hero-floating-tag">
                  <div className="cp-floating-icon">
                    <Award size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "14px" }}>Apex Realty Group</div>
                    <div style={{ fontSize: "12px", color: "#64748B" }}>₹14.2 Lakhs Commission Paid this Month</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE COMMISSION CALCULATOR */}
      <section id="calculator" className="cp-section cp-section-light">
        <div className="container">
          <div className="cp-section-header">
            <span className="cp-section-tag">Earnings Potential</span>
            <h2 className="cp-section-title">See How Much You Can Earn Every Month</h2>
            <p className="cp-section-subtitle">
              Adjust the property ticket size and your anticipated monthly closures to calculate
              your direct commission potential with our exclusive mandate inventory.
            </p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="cp-calculator-card">
                <div className="row g-5 align-items-center">
                  <div className="col-md-7">
                    {/* Slider 1: Ticket Size */}
                    <div className="cp-calc-control-group">
                      <div className="cp-calc-label-row">
                        <label className="cp-calc-label">Average Property Ticket Size</label>
                        <span className="cp-calc-val-badge">₹{ticketSize} Cr</span>
                      </div>
                      <input
                        type="range"
                        className="cp-slider"
                        min="0.5"
                        max="10.0"
                        step="0.25"
                        value={ticketSize}
                        onChange={(e) => setTicketSize(parseFloat(e.target.value))}
                      />
                      <div className="d-flex justify-content-between text-muted small mt-1">
                        <span>₹50 Lakhs</span>
                        <span>₹5.0 Cr</span>
                        <span>₹10.0 Cr</span>
                      </div>
                    </div>

                    {/* Slider 2: Monthly Closures */}
                    <div className="cp-calc-control-group">
                      <div className="cp-calc-label-row">
                        <label className="cp-calc-label">Expected Deals Closed Per Month</label>
                        <span className="cp-calc-val-badge">{monthlyDeals} {monthlyDeals === 1 ? "Deal" : "Deals"}</span>
                      </div>
                      <input
                        type="range"
                        className="cp-slider"
                        min="1"
                        max="12"
                        step="1"
                        value={monthlyDeals}
                        onChange={(e) => setMonthlyDeals(parseInt(e.target.value))}
                      />
                      <div className="d-flex justify-content-between text-muted small mt-1">
                        <span>1 Deal</span>
                        <span>6 Deals</span>
                        <span>12 Deals</span>
                      </div>
                    </div>

                    {/* Slider 3: Commission Percentage */}
                    <div className="cp-calc-control-group mb-0">
                      <div className="cp-calc-label-row">
                        <label className="cp-calc-label">Mandate Commission Slab</label>
                        <span className="cp-calc-val-badge">{commissionRate}%</span>
                      </div>
                      <input
                        type="range"
                        className="cp-slider"
                        min="2.0"
                        max="4.0"
                        step="0.25"
                        value={commissionRate}
                        onChange={(e) => setCommissionRate(parseFloat(e.target.value))}
                      />
                      <div className="d-flex justify-content-between text-muted small mt-1">
                        <span>2.0% (Standard)</span>
                        <span>3.0% (Prime)</span>
                        <span>4.0% (Commercial / Top Tier)</span>
                      </div>
                    </div>
                  </div>

                  {/* Calculator Results Box */}
                  <div className="col-md-5">
                    <div className="cp-calc-results-box">
                      <div>
                        <div className="cp-calc-res-title">Estimated Monthly Commission</div>
                        <div className="cp-calc-earnings-huge">
                          {formatCurrency(monthlyEarningsLakhs)}
                        </div>
                        <div className="cp-calc-annual-sub">
                          Approx. <strong>{formatCurrency(annualEarningsLakhs)}</strong> / year
                        </div>

                        <ul className="cp-calc-feature-list">
                          <li>
                            <CheckCircle2 size={16} /> Direct developer billing & fast disbursal
                          </li>
                          <li>
                            <CheckCircle2 size={16} /> Milestone advances upon 10% customer pay
                          </li>
                          <li>
                            <CheckCircle2 size={16} /> Volume incentive bonuses on quarterly targets
                          </li>
                        </ul>
                      </div>

                      <Link to="/register-cp" className="btn btn-light w-100 fw-bold py-3 text-primary rounded-3 shadow-sm">
                        Claim Your Earning Potential <ArrowRight size={16} className="ms-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY PARTNER / CORE ADVANTAGES (6 PILLARS) */}
      <section id="why-us" className="cp-section cp-section-gray">
        <div className="container">
          <div className="cp-section-header">
            <span className="cp-section-tag">Competitive Edge</span>
            <h2 className="cp-section-title">Why Top Brokers Choose Our Mandate Network</h2>
            <p className="cp-section-subtitle">
              We empower channel partners with developer-direct inventory, dedicated on-ground
              support, transparent contracts, and high-margin payouts.
            </p>
          </div>

          <div className="row g-4">
            {/* Benefit 1 */}
            <div className="col-lg-4 col-md-6">
              <div className="cp-benefit-card">
                <div className="cp-benefit-icon-box icon-blue">
                  <Building2 />
                </div>
                <h3 className="cp-benefit-title">Exclusive Developer Mandates</h3>
                <p className="cp-benefit-text">
                  Direct access to prime residential and commercial projects. Eliminate middlemen,
                  avoid broker undercutting, and pitch inventory with verified developer backing.
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="col-lg-4 col-md-6">
              <div className="cp-benefit-icon-box icon-emerald">
                <Percent />
              </div>
              <h3 className="cp-benefit-title">Industry-Leading Commissions</h3>
              <p className="cp-benefit-text">
                Enjoy guaranteed payout slabs between 2.0% to 4.0%+ with fast-track milestone
                advances upon booking token and agreement execution.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="col-lg-4 col-md-6">
              <div className="cp-benefit-icon-box icon-indigo">
                <ShieldCheck />
              </div>
              <h3 className="cp-benefit-title">100% Lead Protection & Locking</h3>
              <p className="cp-benefit-text">
                Client registrations are digitally locked to your partner ID in our CRM for up to
                180 days. Zero fear of internal poaching or commission splits.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="col-lg-4 col-md-6">
              <div className="cp-benefit-icon-box icon-amber">
                <Users />
              </div>
              <h3 className="cp-benefit-title">Dedicated Relationship Manager</h3>
              <p className="cp-benefit-text">
                Receive hands-on support from seasoned real estate managers for high-ticket customer
                site visits, inventory reservations, and closing negotiations.
              </p>
            </div>

            {/* Benefit 5 */}
            <div className="col-lg-4 col-md-6">
              <div className="cp-benefit-icon-box icon-cyan">
                <FileText />
              </div>
              <h3 className="cp-benefit-title">High-Converting Sales Collaterals</h3>
              <p className="cp-benefit-text">
                Instantly download co-branded digital brochures, 3D interactive walkthroughs,
                floorplans, pricing calculators, and promotional social media kits.
              </p>
            </div>

            {/* Benefit 6 */}
            <div className="col-lg-4 col-md-6">
              <div className="cp-benefit-icon-box icon-rose">
                <TrendingUp />
              </div>
              <h3 className="cp-benefit-title">Real-Time CRM & Payout Tracking</h3>
              <p className="cp-benefit-text">
                Manage your agency's pipeline on our mobile-friendly dashboard. Track site visits,
                booking progress, and payment approvals with complete transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS (4-STEP ONBOARDING) */}
      <section id="how-it-works" className="cp-section cp-section-light">
        <div className="container">
          <div className="cp-section-header">
            <span className="cp-section-tag">Seamless Process</span>
            <h2 className="cp-section-title">Become a Partner in 4 Simple Steps</h2>
            <p className="cp-section-subtitle">
              Our streamlined onboarding process gets your agency verified and ready to sell within 48 hours.
            </p>
          </div>

          <div className="cp-steps-grid">
            {/* Step 1 */}
            <div className="cp-step-card">
              <div className="cp-step-number-badge">1</div>
              <h4 className="cp-step-title">Submit Online Form</h4>
              <p className="cp-step-desc">
                Fill in your agency profile, contact details, and upload valid PAN and RERA certificates.
              </p>
            </div>

            {/* Step 2 */}
            <div className="cp-step-card">
              <div className="cp-step-number-badge">2</div>
              <h4 className="cp-step-title">Fast-Track Verification</h4>
              <p className="cp-step-desc">
                Our compliance team reviews your documentation within 24 to 48 business hours.
              </p>
            </div>

            {/* Step 3 */}
            <div className="cp-step-card">
              <div className="cp-step-number-badge">3</div>
              <h4 className="cp-step-title">Get Portal Access & RM</h4>
              <p className="cp-step-desc">
                Receive your CRM login credentials, marketing assets, and get paired with a dedicated RM.
              </p>
            </div>

            {/* Step 4 */}
            <div className="cp-step-card">
              <div className="cp-step-number-badge">4</div>
              <h4 className="cp-step-title">Close Deals & Get Paid</h4>
              <p className="cp-step-desc">
                Register buyer leads, organize site tours, finalize bookings, and enjoy timely payouts.
              </p>
            </div>
          </div>

          <div className="text-center mt-5">
            <Link to="/register-cp" className="btn-hero-primary">
              Start Your Registration <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. MANDATES SHOWCASE (PORTFOLIO PREVIEW) */}
      <section id="mandates" className="cp-section cp-section-gray">
        <div className="container">
          <div className="cp-section-header">
            <span className="cp-section-tag">Exclusive Portfolio</span>
            <h2 className="cp-section-title">Current Mandate Inventory Preview</h2>
            <p className="cp-section-subtitle">
              Here is a glimpse of high-demand residential and commercial projects ready for
              partner distribution. Full project collateral is unlocked upon verification.
            </p>
          </div>

          <div className="row g-4">
            {mandateProjects.map((project) => (
              <div className="col-lg-4 col-md-6" key={project.id}>
                <div className="cp-project-card">
                  <div
                    className="cp-project-banner"
                    style={{ background: project.bgGradient }}
                  >
                    <div className="cp-project-tag-top">
                      <span className="cp-badge-mandate">{project.badge}</span>
                      <span className="cp-badge-comm">{project.commission} Commission</span>
                    </div>
                    <div className="cp-project-banner-bottom">
                      <h5>{project.name}</h5>
                      <p>
                        <MapPin size={13} className="me-1" />
                        {project.location}
                      </p>
                    </div>
                  </div>

                  <div className="cp-project-body">
                    <div className="cp-project-features">
                      <span className="cp-project-feature-item">
                        <Layers size={14} /> {project.type}
                      </span>
                      <span className="cp-project-feature-item">
                        <Clock size={14} /> {project.inventory}
                      </span>
                    </div>

                    <div className="cp-project-action-row">
                      <div>
                        <div className="cp-project-price-label">Ticket Size</div>
                        <div className="cp-project-price-val">{project.price}</div>
                      </div>
                      <Link to="/register-cp" className="btn-project-cta">
                        Unlock Mandate
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <p className="text-muted small mb-3">
              * Over 15+ additional residential towers and Grade-A commercial projects available on partner CRM dashboard.
            </p>
            <Link to="/register-cp" className="btn btn-outline-primary fw-bold px-4 py-2 rounded-pill">
              Register to View Full Inventory Catalog
            </Link>
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS & SOCIAL PROOF */}
      <section className="cp-section cp-section-light">
        <div className="container">
          <div className="cp-section-header">
            <span className="cp-section-tag">Partner Stories</span>
            <h2 className="cp-section-title">Trusted by India's Leading Property Advisors</h2>
            <p className="cp-section-subtitle">
              Hear directly from real estate professionals who grew their brokerage transaction volume with us.
            </p>
          </div>

          <div className="row g-4">
            {/* Testimonial 1 */}
            <div className="col-lg-4 col-md-6">
              <div className="cp-testimonial-card">
                <div>
                  <div className="cp-testimonial-stars">
                    <Star size={16} fill="#F59E0B" />
                    <Star size={16} fill="#F59E0B" />
                    <Star size={16} fill="#F59E0B" />
                    <Star size={16} fill="#F59E0B" />
                    <Star size={16} fill="#F59E0B" />
                  </div>
                  <p className="cp-testimonial-text">
                    "The lead locking mechanism is an absolute game changer. In Gurgaon, client poaching is rampant,
                    but having our leads digitally timestamped gave our 12-member team complete peace of mind. Payouts
                    are always on the clock."
                  </p>
                </div>
                <div className="cp-testimonial-author">
                  <div className="cp-author-avatar">VK</div>
                  <div className="cp-author-info">
                    <h6>Vikas Kapoor</h6>
                    <p>Managing Director, Apex Square Realty (Gurgaon)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="col-lg-4 col-md-6">
              <div className="cp-testimonial-card">
                <div>
                  <div className="cp-testimonial-stars">
                    <Star size={16} fill="#F59E0B" />
                    <Star size={16} fill="#F59E0B" />
                    <Star size={16} fill="#F59E0B" />
                    <Star size={16} fill="#F59E0B" />
                    <Star size={16} fill="#F59E0B" />
                  </div>
                  <p className="cp-testimonial-text">
                    "Our assigned RM helped us coordinate 15 high-net-worth customer visits in a single weekend.
                    Having developer-direct inventory and fast commission disbursement enabled us to scale our
                    agency revenue by 3x within 6 months."
                  </p>
                </div>
                <div className="cp-testimonial-author">
                  <div className="cp-author-avatar" style={{ background: "linear-gradient(135deg, #059669, #10B981)" }}>
                    SM
                  </div>
                  <div className="cp-author-info">
                    <h6>Sunita Mathur</h6>
                    <p>Founder, PrimeSpace Consultants (Noida)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="col-lg-4 col-md-6">
              <div className="cp-testimonial-card">
                <div>
                  <div className="cp-testimonial-stars">
                    <Star size={16} fill="#F59E0B" />
                    <Star size={16} fill="#F59E0B" />
                    <Star size={16} fill="#F59E0B" />
                    <Star size={16} fill="#F59E0B" />
                    <Star size={16} fill="#F59E0B" />
                  </div>
                  <p className="cp-testimonial-text">
                    "As an individual consultant, getting access to Grade-A developer commercial mandates was
                    almost impossible. Through this partner network, I closed two retail spaces worth ₹6 Cr and
                    received full commission without any follow-up hassles."
                  </p>
                </div>
                <div className="cp-testimonial-author">
                  <div className="cp-author-avatar" style={{ background: "linear-gradient(135deg, #7C3AED, #8B5CF6)" }}>
                    RN
                  </div>
                  <div className="cp-author-info">
                    <h6>Rohit Nair</h6>
                    <p>Independent Real Estate Advisor (Delhi NCR)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQS SECTION */}
      <section id="faqs" className="cp-section cp-section-gray">
        <div className="container">
          <div className="cp-section-header">
            <span className="cp-section-tag">Got Questions?</span>
            <h2 className="cp-section-title">Frequently Asked Questions</h2>
            <p className="cp-section-subtitle">
              Everything you need to know about our Channel Partner program, commission structures, and policies.
            </p>
          </div>

          <div className="row justify-content-center">
            <div className="col-lg-8">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className={`cp-faq-item ${activeFaq === idx ? "active" : ""}`}
                >
                  <div
                    className="cp-faq-question"
                    onClick={() => setActiveFaq(activeFaq === idx ? -1 : idx)}
                  >
                    <h5>{faq.q}</h5>
                    <ChevronDown size={18} className="cp-faq-icon" />
                  </div>
                  {activeFaq === idx && (
                    <div className="cp-faq-answer">{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. BOTTOM CLOSING CTA BANNER */}
      <section className="cp-cta-banner-wrapper">
        <div className="container">
          <div className="cp-cta-banner">
            <h2 className="cp-cta-title">Ready to 10x Your Real Estate Revenue?</h2>
            <p className="cp-cta-subtitle">
              Join 1,200+ verified channel partners and unlock exclusive developer mandates,
              guaranteed client locking, and industry-leading commission payouts.
            </p>
            <div className="cp-cta-btn-group">
              <Link to="/register-cp" className="btn-cta-white">
                Register as Channel Partner <ArrowRight size={18} />
              </Link>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="btn-cta-outline"
              >
                <PhoneCall size={18} /> Request an Express Callback
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 10. EXPRESS CALLBACK MODAL */}
      {showModal && (
        <div className="cp-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="cp-modal-window" onClick={(e) => e.stopPropagation()}>
            <button
              className="cp-modal-close-btn"
              onClick={() => setShowModal(false)}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
            <div className="text-center mb-4">
              <div
                className="d-inline-flex p-3 rounded-circle mb-2"
                style={{ background: "#EFF6FF", color: "#2563EB" }}
              >
                <PhoneCall size={26} />
              </div>
              <h4 className="fw-bold mb-1">Request Partner Callback</h4>
              <p className="text-muted small mb-0">
                Have quick questions before registering? Our channel partnership desk will call you directly.
              </p>
            </div>

            <form onSubmit={handleCallbackSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Rajesh Malhotra"
                  value={callbackForm.name}
                  onChange={(e) => setCallbackForm({ ...callbackForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Mobile Number *</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="10-digit mobile number"
                  value={callbackForm.phone}
                  onChange={(e) => setCallbackForm({ ...callbackForm, phone: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold">Operational City</label>
                <select
                  className="form-select"
                  value={callbackForm.city}
                  onChange={(e) => setCallbackForm({ ...callbackForm, city: e.target.value })}
                >
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Gurgaon">Gurgaon</option>
                  <option value="Noida">Noida</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-semibold rounded-3 mb-3"
                disabled={submittingCallback}
              >
                {submittingCallback ? "Submitting..." : "Schedule Callback"}
              </button>

              <div className="text-center">
                <span className="text-muted small">Ready with RERA & PAN? </span>
                <Link
                  to="/register-cp"
                  className="small fw-bold text-decoration-none text-primary"
                  onClick={() => setShowModal(false)}
                >
                  Complete Full Registration →
                </Link>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 11. FOOTER */}
      <footer className="cp-footer">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="cp-footer-logo-row">
                <img
                  src={assets.fcp_logo}
                  alt="Logo"
                  height={44}
                  style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }}
                />
              </div>
              <p className="small text-muted mb-3">
                India's premier real estate mandate and channel partner network. Empowering
                brokers with exclusive developer inventories, transparent commission payouts,
                and digital lead management technology.
              </p>
              <div className="small text-muted">
                <i className="fa-solid fa-envelope me-2 text-primary"></i> partners@realtynetwork.com
              </div>
              <div className="small text-muted mt-1">
                <i className="fa-solid fa-phone me-2 text-primary"></i> +91 (011) 4567-8900
              </div>
            </div>

            <div className="col-lg-2 col-md-6 col-6">
              <h6 className="cp-footer-title">Program</h6>
              <ul className="cp-footer-links">
                <li><a href="#why-us">Why Partner</a></li>
                <li><a href="#calculator">Earnings Calc</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="#mandates">Mandate Inventory</a></li>
                <li><Link to="/register-cp">Register Agency</Link></li>
              </ul>
            </div>

            <div className="col-lg-2 col-md-6 col-6">
              <h6 className="cp-footer-title">Portals</h6>
              <ul className="cp-footer-links">
                <li><Link to="/login">Partner Login</Link></li>
                <li><Link to="/login">Staff CRM</Link></li>
                <li><Link to="/register-cp">CP Application</Link></li>
                <li><a href="#faqs">Broker FAQs</a></li>
              </ul>
            </div>

            <div className="col-lg-4 col-md-6">
              <h6 className="cp-footer-title">Compliance & Verification</h6>
              <p className="cp-rera-disclaimer">
                All real estate transactions, lead registrations, and project mandates promoted on
                this platform comply with the Real Estate (Regulation and Development) Act, 2016 (RERA).
                Channel partners must maintain active RERA certifications.
              </p>
              <div className="d-flex gap-2">
                <Link to="/register-cp" className="btn btn-sm btn-primary rounded-pill px-3">
                  Become a Partner
                </Link>
                <Link to="/login" className="btn btn-sm btn-outline-light rounded-pill px-3">
                  Sign In
                </Link>
              </div>
            </div>
          </div>

          <div className="cp-footer-bottom">
            <div className="small text-muted">
              © {new Date().getFullYear()} Channel Partner Mandate Network. All rights reserved.
            </div>
            <div className="d-flex gap-3 small text-muted">
              <a href="#faqs" className="text-muted text-decoration-none">Privacy Policy</a>
              <span>•</span>
              <a href="#faqs" className="text-muted text-decoration-none">Terms of Partnership</a>
              <span>•</span>
              <a href="#faqs" className="text-muted text-decoration-none">RERA Disclaimer</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ChannelPartnerLanding;
