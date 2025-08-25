import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

const Layout: React.FC = () => {
  console.log('Layout component rendered')

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      {/* Render Sidebar */}
      <Sidebar />

      <div className="lg:pl-64">
        {/* Render Header */}
        <Header />

        <main className="p-4 lg:p-8">
          <div className="min-h-[50vh]">
            {/* Debug: Show what route we're on */}
            <div className="bg-blue-100 dark:bg-blue-900 p-2 mb-4 rounded text-sm">
              Current Route: {window.location.pathname}
            </div>

            {/* Simple test first */}
            <div className="bg-pink-100 dark:bg-pink-900 p-2 mb-4 rounded">
              <p className="text-pink-800 dark:text-pink-200 font-bold">
                🩷 LAYOUT IS WORKING - Sidebar and Header should be visible above!
              </p>
            </div>

            {/* This should render the Dashboard or other page */}
            <div className="border-2 border-dashed border-green-500 p-4">
              <p className="text-green-600 dark:text-green-400 font-bold">
                OUTLET AREA - This is where pages should render:
              </p>

              {/* Test Outlet - Make it very visible */}
              <div className="mt-4 border-4 border-red-500 p-4 bg-red-50 dark:bg-red-900">
                <p className="text-red-800 dark:text-red-200 font-bold text-lg">
                  🔴 OUTLET CONTENT SHOULD BE HERE:
                </p>
                <div className="min-h-[200px] border-2 border-red-300 bg-white dark:bg-secondary-800 mt-2">
                  {/* Test: Direct content instead of Outlet */}
                  <div className="p-4 bg-purple-100 dark:bg-purple-900 m-4 rounded">
                    <h3 className="text-purple-800 dark:text-purple-200 font-bold">
                      🎯 DIRECT CONTENT TEST 🎯
                    </h3>
                    <p className="text-purple-700 dark:text-purple-300">
                      If you see this purple box, the area is working but Outlet is not.
                    </p>
                  </div>

                  {/* Now test Outlet */}
                  <div className="border-t border-red-300 mt-4 pt-4">
                    <p className="text-red-600 font-bold mb-2">OUTLET BELOW:</p>
                    <Outlet />
                  </div>
                </div>
                <p className="text-red-600 dark:text-red-400 text-sm mt-2">
                  You should see a purple box above and outlet content below.
                </p>
              </div>
            </div>

            {/* Fallback content if Outlet doesn't work */}
            <div className="mt-8 bg-yellow-100 dark:bg-yellow-900 p-4 rounded">
              <h3 className="text-yellow-800 dark:text-yellow-200 font-bold">
                🚨 FALLBACK: If you see this, Outlet is not working!
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300">
                The Outlet component should render the page here, but it's not working.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
