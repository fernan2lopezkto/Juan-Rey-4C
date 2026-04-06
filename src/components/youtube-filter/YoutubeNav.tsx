"use client";
import Link from 'next/link';
import { FaCog, FaHistory, FaHome } from 'react-icons/fa';

export default function YoutubeNav() {
    return (
        <div className="flex gap-4 mb-6 border-b border-base-200 pb-2 overflow-x-auto">
            <Link href="/utilities/youtube-filter" className="btn btn-ghost gap-2"><FaHome /> Home</Link>
            <Link href="/utilities/youtube-filter/history" className="btn btn-ghost gap-2"><FaHistory /> History</Link>
            <Link href="/utilities/youtube-filter/config" className="btn btn-ghost gap-2"><FaCog /> Config</Link>
        </div>
    );
}
