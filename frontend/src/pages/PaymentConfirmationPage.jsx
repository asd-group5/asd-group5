import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentConfirmationPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const paymentData = location.state;

    if (!paymentData) {
        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#f3f4f6',
                padding: '2rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    backgroundColor: 'white',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                    borderRadius: '0.5rem',
                    padding: '2rem',
                    width: '100%',
                    maxWidth: '28rem'
                }}>
                    <div style={{
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        <div style={{
                            fontSize: '3.75rem',
                            color: '#ef4444',
                            marginBottom: '1rem'
                        }}>×</div>
                        <h2 style={{
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            color: '#111827'
                        }}>Invalid Access</h2>
                        <p style={{
                            color: '#4b5563'
                        }}>
                            No payment information found. Please try making a payment again.
                        </p>
                        <button
                            onClick={() => navigate("/payment")}
                            style={{
                                padding: '0.75rem 1rem',
                                backgroundColor: '#2563eb',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.375rem',
                                fontSize: '1rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            Return to Payment
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const getStatusStyle = () => {
        switch (paymentData.status) {
            case "COMPLETED":
                return {
                    icon: "✓",
                    color: '#16a34a',
                    backgroundColor: '#dcfce7',
                    borderColor: '#4ade80'
                };
            case "PENDING":
                return {
                    icon: "⏳",
                    color: '#ca8a04',
                    backgroundColor: '#fef9c3',
                    borderColor: '#fcd34d'
                };
            case "FAILED":
                return {
                    icon: "×",
                    color: '#dc2626',
                    backgroundColor: '#fee2e2',
                    borderColor: '#f87171'
                };
            default:
                return {
                    icon: "ℹ",
                    color: '#2563eb',
                    backgroundColor: '#dbeafe',
                    borderColor: '#60a5fa'
                };
        }
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const statusStyle = getStatusStyle();

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f3f4f6',
            padding: '3rem 1rem'
        }}>
            <div style={{
                maxWidth: '32rem',
                margin: '0 auto'
            }}>
                <div style={{
                    backgroundColor: 'white',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                    borderRadius: '0.5rem',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        textAlign: 'center',
                        padding: '1.5rem',
                        borderBottom: '1px solid #e5e7eb'
                    }}>
                        <div style={{
                            fontSize: '3.75rem',
                            marginBottom: '1rem',
                            color: statusStyle.color
                        }}>
                            {statusStyle.icon}
                        </div>
                        <h1 style={{
                            fontSize: '1.875rem',
                            fontWeight: '700',
                            color: '#111827'
                        }}>
                            Payment {paymentData.status.charAt(0) + paymentData.status.slice(1).toLowerCase()}
                        </h1>
                    </div>

                    <div style={{ padding: '1.5rem' }}>
                        <div style={{
                            backgroundColor: statusStyle.backgroundColor,
                            padding: '1.5rem',
                            borderRadius: '0.5rem',
                            marginBottom: '1.5rem'
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    fontSize: '0.875rem',
                                    color: '#4b5563'
                                }}>Amount Paid</div>
                                <div style={{
                                    fontSize: '1.875rem',
                                    fontWeight: '700',
                                    marginTop: '0.25rem',
                                    color: '#111827'
                                }}>
                                    {formatAmount(paymentData.amount)}
                                </div>
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '0.5rem 0',
                                borderBottom: '1px solid #e5e7eb'
                            }}>
                                <span style={{ color: '#4b5563' }}>Status</span>
                                <span style={{
                                    fontWeight: '500',
                                    color: statusStyle.color
                                }}>
                                    {paymentData.status}
                                </span>
                            </div>
                            {paymentData.transactionId && (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '0.5rem 0',
                                    borderBottom: '1px solid #e5e7eb'
                                }}>
                                    <span style={{ color: '#4b5563' }}>Transaction ID</span>
                                    <span style={{
                                        fontWeight: '500',
                                        color: '#111827'
                                    }}>
                                        {paymentData.transactionId}
                                    </span>
                                </div>
                            )}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '0.5rem 0',
                                borderBottom: '1px solid #e5e7eb'
                            }}>
                                <span style={{ color: '#4b5563' }}>Payment ID</span>
                                <span style={{
                                    fontWeight: '500',
                                    color: '#111827'
                                }}>{paymentData.paymentId}</span>
                            </div>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '0.5rem 0',
                                borderBottom: '1px solid #e5e7eb'
                            }}>
                                <span style={{ color: '#4b5563' }}>Date</span>
                                <span style={{
                                    fontWeight: '500',
                                    color: '#111827'
                                }}>{formatDate(new Date())}</span>
                            </div>
                        </div>

                        <div style={{
                            marginTop: '2rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem'
                        }}>
                            <button
                                onClick={() => navigate("/payment")}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    backgroundColor: '#2563eb',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.375rem',
                                    fontSize: '1rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Return to Payment
                            </button>
                            <button
                                onClick={() => window.print()}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    backgroundColor: 'white',
                                    color: '#374151',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.375rem',
                                    fontSize: '1rem',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                Print Receipt
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentConfirmationPage;