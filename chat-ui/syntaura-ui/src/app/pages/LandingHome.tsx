'use client'

import { useState } from "react";
import styled from 'styled-components';
import Image from "next/image";

const StyledImage = styled(Image)`
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  height: 25px;
  width: 25px;

  &:hover {
    transform: scale(1.2);
  }
`;

const StyledLeftList = styled.li`

&:hover {
        color: black;
        background-color: #e3e3e3;
}

`

export default function LandingHome() {
    const [leftPanelOpen, setLeftPanelOpen] = useState(true);
    const [rightPanelOpen, setRightPanelOpen] = useState(true);
    const toggleLeftPanel = () => setLeftPanelOpen(!leftPanelOpen);
    const toggleRightPanel = () => setRightPanelOpen(!rightPanelOpen);
    return (
        <>
            <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
                {/* Main Content Area with Panels */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Left Panel */}
                    <div className={`bg-[#f9f9f9] text-black transition-all duration-300 ease-in-out flex flex-col
          ${leftPanelOpen ? 'w-64 md:w-72' : 'w-0'}`}>

                        {leftPanelOpen && (
                            <div className="p-1 flex-1 overflow-y-auto">
                                {/* Left Panel Toggle Button */}
                                <button
                                    onClick={toggleLeftPanel}
                                    className="transition z-10 transform -translate-x-1/2 rotate-180 pt-4 pr-14 pb-2 pl-2"
                                    style={{ display: leftPanelOpen ? 'block' : 'none' }}
                                >

                                    <StyledImage
                                        className="dark:invert"
                                        src="/assets/images/close_sidebar.png"
                                        alt="Next.js logo"
                                        width={180}
                                        height={38}
                                    />
                                </button>

                                <nav className="pl-2">
                                    <ul className="space-y-2">
                                        {['Dashboard', 'Projects', 'Team', 'Calendar', 'Documents'].map((item) => (
                                            <StyledLeftList key={item}>
                                                <a href="#" className="block px-3 py-2 
                                                rounded  transition 
                                                hover:bg-gray-600 focus:outline-2 focus:outline-offset-2 
                                                focus:outline-gray-500 active:bg-gray-700 
                                               
                                                ">
                                                    {item}
                                                </a>
                                            </StyledLeftList>
                                        ))}
                                    </ul>
                                </nav>
                            </div>
                        )}

                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Header */}
                        <header className="bg-white shadow-sm z-10">
                            <div className="flex items-center justify-between px-4 py-3">
                                <div className="flex items-center">
                                    {!leftPanelOpen && (
                                        <button
                                            onClick={toggleLeftPanel}
                                            className="mr-4 text-gray-500 hover:text-gray-700"
                                        >
                                            <StyledImage
                                                className="dark:invert"
                                                src="/assets/images/close_sidebar.png"
                                                alt="Next.js logo"
                                                width={180}
                                                height={38}
                                            />

                                        </button>
                                    )}
                                    <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
                                </div>
                                <div>
                                    {!rightPanelOpen && (
                                        <button
                                            onClick={toggleRightPanel}
                                            className="ml-4 text-gray-500 hover:text-gray-700"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                            </svg>

                                            {/* <StyledImage src="closeSideBar"></StyledImage> */}

                                        </button>
                                    )}
                                </div>
                            </div>
                        </header>

                        {/* Content Area */}
                        <main className="flex-1 overflow-y-auto  bg-gray-50">
                            <div className="max-w-1xl mx-auto">
                                <div className="bg-white rounded-lg shadow p-6 mb-4">
                                    <h2 className="text-2xl font-bold mb-4">Welcome to your dashboard!</h2>
                                    <p className="text-gray-600 mb-4">
                                        This is the main content area. Resize your browser window to see the responsive behavior.
                                    </p>
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                                        Sample Button
                                    </button>
                                </div>
                                {/* <div className="bg-white rounded-lg shadow p-6">
                                    <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
                                    <div className="space-y-3">
                                        {[1, 2, 3].map((item) => (
                                            <div key={item} className="border-b border-gray-200 pb-3 last:border-0">
                                                <p className="text-gray-700">Activity item {item}</p>
                                                <p className="text-sm text-gray-500">2 hours ago</p>
                                            </div>
                                        ))}
                                    </div>
                                </div> */}
                            </div>
                        </main>
                    </div>

                    {/* Right Panel */}
                    <div className={`bg-gray-800 text-white transition-all duration-300 ease-in-out flex flex-col
          ${rightPanelOpen ? 'w-64 md:w-72' : 'w-0'}`}>

                        {rightPanelOpen && (
                            <div className="p-4 flex-1 overflow-y-auto">
                                <h2 className="text-xl font-bold mb-4">Right Panel</h2>
                                <div className="space-y-4">
                                    <div className="bg-gray-700 p-3 rounded-lg">
                                        <h3 className="font-medium">Notifications</h3>
                                        <p className="text-sm text-gray-300 mt-1">You have 3 new messages</p>
                                    </div>
                                    <div className="bg-gray-700 p-3 rounded-lg">
                                        <h3 className="font-medium">Recent Activity</h3>
                                        <p className="text-sm text-gray-300 mt-1">User login detected</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Right Panel Toggle Button */}
                        <button
                            onClick={toggleRightPanel}
                            className="absolute top-4 right-64 md:right-72 bg-gray-700 text-white p-2 rounded-full shadow-lg hover:bg-gray-600 transition z-10
            transform translate-x-1/2"
                            style={{ display: rightPanelOpen ? 'block' : 'none' }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-gray-800 text-white py-4 px-6 border-t border-gray-700">
                    <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <p className="text-sm text-gray-400">
                                © {new Date().getFullYear()} Your Company. All rights reserved.
                            </p>
                        </div>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white transition">
                                <span className="sr-only">Facebook</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition">
                                <span className="sr-only">Twitter</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition">
                                <span className="sr-only">GitHub</span>
                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </footer>
            </div>

        </>
    );
}
