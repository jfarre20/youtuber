import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, FileText, Shield, Users, AlertCircle } from 'lucide-react'

const Terms: React.FC = () => {
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
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
              Terms of Service
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
              Welcome to YouTube Clip Sequencer ("we," "us," or "our"). These Terms of Service ("Terms") govern your access to and use of our web application and services. By accessing or using our service, you agree to be bound by these Terms.
            </p>
          </section>

          {/* Acceptance */}
          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              2. Acceptance of Terms
            </h2>
            <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed mb-3">
              By creating an account, accessing, or using YouTube Clip Sequencer, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.
            </p>
            <div className="bg-secondary-100 dark:bg-secondary-800 p-4 rounded-lg">
              <p className="text-secondary-700 dark:text-secondary-300 text-sm">
                If you do not agree to these Terms, please do not use our service.
              </p>
            </div>
          </section>

          {/* Description of Service */}
          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              3. Description of Service
            </h2>
            <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed mb-3">
              YouTube Clip Sequencer is a web application that allows users to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-secondary-700 dark:text-secondary-300 ml-4">
              <li>Extract and sequence clips from YouTube videos</li>
              <li>Create professional video edits with timeline-based tools</li>
              <li>Collaborate with other users in real-time</li>
              <li>Export edited videos in multiple formats</li>
              <li>Store and manage video projects and clips</li>
            </ul>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              4. User Accounts
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-secondary-900 dark:text-secondary-100">Account Creation</h3>
                  <p className="text-secondary-700 dark:text-secondary-300 mt-1">
                    You must create an account to use certain features. You are responsible for maintaining the confidentiality of your account credentials.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-secondary-900 dark:text-secondary-100">Account Security</h3>
                  <p className="text-secondary-700 dark:text-secondary-300 mt-1">
                    You agree to notify us immediately of any unauthorized use of your account or any other breach of security.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              5. Acceptable Use Policy
            </h2>
            <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed mb-3">
              You agree not to use the service to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-secondary-700 dark:text-secondary-300 ml-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Upload harmful, offensive, or inappropriate content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Distribute malware or engage in harmful activities</li>
              <li>Use the service for commercial purposes without permission</li>
            </ul>
          </section>

          {/* Content and Copyright */}
          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              6. Content and Copyright
            </h2>
            <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed mb-3">
              You retain ownership of content you create using our service. However, by using YouTube Clip Sequencer, you grant us a limited license to process and store your content as necessary to provide the service.
            </p>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200">YouTube Content</h3>
                  <p className="text-amber-700 dark:text-amber-300 mt-1 text-sm">
                    You are responsible for ensuring you have the right to use any YouTube content in your projects. We do not claim ownership of YouTube videos or their content.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              7. Privacy
            </h2>
            <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
              Your privacy is important to us. Please review our{' '}
              <Link to="/privacy" className="text-primary-600 hover:text-primary-500 underline">
                Privacy Policy
              </Link>
              {' '}which explains how we collect, use, and protect your information.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              8. Termination
            </h2>
            <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed mb-3">
              We reserve the right to terminate or suspend your account at our discretion if you violate these Terms or engage in harmful activities.
            </p>
            <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
              You may terminate your account at any time by contacting us or using the account deletion feature in your profile settings.
            </p>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              9. Disclaimers
            </h2>
            <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed mb-3">
              The service is provided "as is" without warranties of any kind. We do not guarantee that the service will be uninterrupted or error-free.
            </p>
            <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
              You use the service at your own risk and are responsible for any damages or losses that may result from your use of the service.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              10. Limitation of Liability
            </h2>
            <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
              In no event shall YouTube Clip Sequencer be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the service.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              11. Changes to Terms
            </h2>
            <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or through the service. Your continued use of the service after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              12. Contact Information
            </h2>
            <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed">
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="bg-secondary-100 dark:bg-secondary-800 p-4 rounded-lg mt-3">
              <p className="text-secondary-700 dark:text-secondary-300">
                Email: legal@youtubeclipsequencer.com<br />
                Support: support@youtubeclipsequencer.com
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-secondary-500 dark:text-secondary-400 text-sm">
            These Terms of Service were last updated on {currentDate}.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <Link
              to="/privacy"
              className="text-primary-600 hover:text-primary-500 underline"
            >
              Privacy Policy
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

export default Terms
