export default function FAQPage() {
  return (
    <main className="page">
      <h1 className="text-2xl font-bold mb-6">Frequently Asked Questions</h1>

      {/* General */}
      <section className="card mb-4">
        <div className="card-body">
          <h2 className="text-lg font-semibold mb-2">General</h2>
          <details className="mb-3">
            <summary className="cursor-pointer font-medium">What is Maylo?</summary>
            <p className="mt-2 text-slate-600">
              Maylo helps you find local service providers who speak your language.
              You can search by branch, country and city, save favorites and leave reviews.
            </p>
          </details>

          <details className="mb-3">
            <summary className="cursor-pointer font-medium">Do I need an account?</summary>
            <p className="mt-2 text-slate-600">
              You can browse without an account. Creating an account lets you save favorites and write reviews. And you will be entitled to special offers for registered users.
            </p>
          </details>
        </div>
      </section>

      {/* For Service Providers */}
      <section id="providers" className="card mb-4 scroll-mt-24">
        <div className="card-body">
          <h2 className="text-lg font-semibold mb-2">For Service Providers</h2>

          <details className="mb-3">
            <summary className="cursor-pointer font-medium">Who should select “I’m a service provider”?</summary>
            <p className="mt-2 text-slate-600">
              Companies and sole proprietors who want to publish their business profile on Maylo.
              Regular users searching for services should not enable this option.
            </p>
          </details>

          <details className="mb-3">
            <summary className="cursor-pointer font-medium">What do I need to register my business?</summary>
            <p className="mt-2 text-slate-600">
              Basic company details (name, address, contact info), your service categories and languages.
              You must be authorized to represent the business.
            </p>
          </details>

          <details className="mb-3">
            <summary className="cursor-pointer font-medium">Is there a free period?</summary>
            <p className="mt-2 text-slate-600">
              Yes. We’ll announce promotional free periods for early providers.
            </p>
          </details>

          <details>
            <summary className="cursor-pointer font-medium">I selected provider by mistake—what now?</summary>
            <p className="mt-2 text-slate-600">
              You can continue as a regular user. If you created an account with provider role,
              contact support and we’ll switch your role.
            </p>
          </details>
        </div>
      </section>

      {/* Privacy & Reviews */}
      <section className="card">
        <div className="card-body">
          <h2 className="text-lg font-semibold mb-2">Privacy & Reviews</h2>
          <details className="mb-3">
            <summary className="cursor-pointer font-medium">How are ratings calculated?</summary>
            <p className="mt-2 text-slate-600">
              Rating is the average of all published reviews for a provider.
            </p>
          </details>

          <details>
            <summary className="cursor-pointer font-medium">Can I edit or delete my review?</summary>
            <p className="mt-2 text-slate-600">
              You can edit or remove your own reviews from the My Reviews page.
            </p>
          </details>
        </div>
      </section>
    </main>
  )
}
