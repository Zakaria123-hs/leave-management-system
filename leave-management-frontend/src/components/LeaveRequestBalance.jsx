import React from 'react';

const LeaveRequestBalance = ({ balance = [], onClose }) => {
    return (
        /* Full screen fixed backdrop to center the modal and blur the dashboard background */
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-fadeIn">
            
            {/* The Modal Content Box */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-3xl w-full relative overflow-hidden p-8">
                
                {/* Close Button (X) in Top-Right Corner */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {balance.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">No active balance metrics found.</div>
                ) : (
                    /* The Modal Grid Layout for Metrics Boxes */
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                        {balance.map((item, index) => {
                            const remaining = parseFloat(item.remaining_days || 0);
                            const used = parseFloat(item.used_days || 0);
                            // Assuming used + remaining represents the global pool, 
                            // you can add pending days calculation logic here if needed
                            const pendingMock = 4.5; 

                            return (
                                <React.Fragment key={index}>
                                    {/* Box 1: Approved/Used Days */}
                                    <div className="bg-white border border-gray-100 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm min-h-[180px]">
                                        <span className="text-5xl font-semibold text-emerald-500 tracking-tight mb-2">
                                            {used}
                                        </span>
                                        <span className="text-sm font-medium text-gray-500 tracking-wide">
                                            Days approved
                                        </span>
                                    </div>

                                    {/* Box 2: Awaiting Approval (Pending) */}
                                    <div className="bg-white border border-gray-100 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm min-h-[180px]">
                                        <span className="text-5xl font-semibold text-blue-500 tracking-tight mb-2">
                                            {pendingMock}
                                        </span>
                                        <span className="text-sm font-medium text-gray-500 tracking-wide">
                                            Days awaiting approval
                                        </span>
                                    </div>

                                    {/* Box 3: Remaining Days */}
                                    <div className="bg-white border border-gray-100 rounded-xl p-6 flex flex-col items-center justify-center text-center shadow-sm min-h-[180px]">
                                        <span className="text-5xl font-semibold text-slate-700 tracking-tight mb-2">
                                            {remaining}
                                        </span>
                                        <span className="text-sm font-medium text-gray-500 tracking-wide">
                                            Days remaining
                                        </span>
                                    </div>
                                </React.Fragment>
                            );
                        })}
                    </div>
                )}
                
                {/* Optional Lower Section Info Title Text */}
                <div className="mt-6 text-center text-xs font-semibold text-gray-400 tracking-wider uppercase">
                    {balance[0]?.leave_type || 'Time Requests Account Metric Summary'}
                </div>
            </div>
        </div>
    );
};

export default LeaveRequestBalance;