import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Shield, Eye, Lock, Database, Cookie, Mail } from 'lucide-react'

const Privacy: React.FC = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-500 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
              Privacy Policy
            </h1>
            <p className="text-secondary-600 dark:text-secondary-400 mt-2">
              Last updated: {currentDate}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="card space-y-6">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              1. Introduction
            </h2>
            <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
              At YouTube Clip Sequencer, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              2. Information We Collect
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Eye className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-secondary-900 dark:text-secondary-100">Personal Information</h3>
                  <p className="text-secondary-700 dark:text-secondary-300 mt-1">
                    When you create an account or use our service, we may collect your email address, username, and profile information.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Database className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-secondary-900 dark:text-secondary-100">Usage Data</h3>
                  <p className="text-secondary-700 dark:text-secondary-300 mt-1">
                    We collect information about how you use our service, including pages visited, features used, and time spent on the platform.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Cookie className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-secondary-900 dark:text-secondary-100">Cookies and Tracking</h3>
                  <p className="text-secondary-700 dark:text-secondary-300 mt-1">
                    We use cookies and similar technologies to enhance your experience, remember your preferences, and analyze usage patterns.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              3. How We Use Your Information
            </h2>
            <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed mb-3">
              We use the information we collect for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-secondary-700 dark:text-secondary-300 ml-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process authentication and manage user accounts</li>
              <li>Communicate with you about our services</li>
              <li>Analyze usage patterns to improve user experience</li>
              <li>Ensure security and prevent fraud</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              4. Information Sharing and Disclosure
            </h2>
            <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed mb-3">
              We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-secondary-700 dark:text-secondary-300 ml-4">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and prevent fraud</li>
              <li>In connection with a business transfer or acquisition</li>
              <li>To service providers who assist in our operations (under strict confidentiality agreements)</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              5. Data Security
            </h2>
            <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed mb-3">
              We implement appropriate security measures to protect your personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-secondary-700 dark:text-secondary-300 ml-4">
              <li>Encryption of sensitive data in transit and at rest</li>
              <li>Regular security audits and updates</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Secure hosting infrastructure</li>
              <li>Regular backups with encryption</li>
            </ul>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg mt-4">
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              6. Your Rights and Choices
            </h2>
            <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed mb-3">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-secondary-700 dark:text-secondary-300 ml-4">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Rectification:</strong> Correct inaccurate or incomplete information</li>
              <li><strong>Erasure:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Request your data in a structured format</li>
              <li><strong>Restriction:</strong> Limit how we process your information</li>
              <li><strong>Objection:</strong> Object to certain processing activities</li>
            </ul>
            <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed mt-3">
              To exercise these rights, please contact us using the information provided below.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              7. Cookies and Tracking Technologies
            </h2>
            <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed mb-3">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-secondary-700 dark:text-secondary-300 ml-4">
              <li>Remember your preferences and settings</li>
              <li>Keep you signed in across sessions</li>
              <li>Analyze usage patterns and improve performance</li>
              <li>Provide personalized content and recommendations</li>
            </ul>
            <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed mt-3">
              You can control cookie preferences through your browser settings, though disabling cookies may affect service functionality.
            </p>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              8. Third-Party Services
            </h2>
            <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed mb-3">
              Our service may integrate with third-party services:
            </p>
            <ul className="list-disc list-inside space-y-2 text-secondary-700 dark:text-secondary-300 ml-4">
              <li><strong>YouTube:</strong> For video content extraction (we only access public video data)</li>
              <li><strong>Discord:</strong> For OAuth authentication (we only access basic profile information)</li>
              <li><strong>Analytics:</strong> To understand usage patterns and improve our service</li>
            </ul>
            <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed mt-3">
              These third parties have their own privacy policies, and we encourage you to review them.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              9. Children's Privacy
            </h2>
            <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
              Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              10. Data Retention
            </h2>
            <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
              We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy, unless a longer retention period is required by law. When you delete your account, we will delete your personal information within 30 days, except where retention is required for legal or legitimate business purposes.
            </p>
          </section>

          {/* International Data Transfers */}
          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              11. International Data Transfers
            </h2>
            <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
              Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards to protect your information.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              12. Changes to This Privacy Policy
            </h2>
            <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of our service after any changes constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              13. Contact Us
            </h2>
            <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed mb-3">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-secondary-100 dark:bg-secondary-800 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="w-5 h-5 text-primary-500" />
                <span className="font-semibold text-secondary-900 dark:text-secondary-100">Email</span>
              </div>
              <p className="text-secondary-700 dark:text-secondary-300">
                Privacy: privacy@youtubeclipsequencer.com<br />
                Support: support@youtubeclipsequencer.com<br />
                Legal: legal@youtubeclipsequencer.com
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-secondary-500 dark:text-secondary-400 text-sm">
            This Privacy Policy was last updated on {currentDate}.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Link
              to="/terms"
              className="text-primary-600 hover:text-primary-500 underline"
            >
              Terms of Service
            </Link>
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-500 underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Privacy
