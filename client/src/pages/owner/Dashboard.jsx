import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext.jsx'
import toast from 'react-hot-toast'
import { useLocation } from 'react-router-dom'

const Dashboard = () => {
  const { axios, isOwner, currency } = useAppContext()
  const location = useLocation()

  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  })

  const dashboardCards = [
    { title: "Total Cars", value: data?.totalCars, icon: assets.carIconColored },
    { title: "Total Bookings", value: data?.totalBookings, icon: assets.listIconColored },
    { title: "Pending", value: data?.pendingBookings, icon: assets.cautionIconColored },
    { title: "Confirmed", value: data?.completedBookings, icon: assets.listIconColored },
  ]

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get('/api/owner/dashboard')
      if (data.success) {
        setData(data.DashboardData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong")
    }
  }

  useEffect(() => {
    if (isOwner) {
      fetchDashboardData()
    }
  }, [isOwner, location.state?.refresh])

  return (
    <div className='px-4 pt-10 md:px-10 flex-1'>
      <Title
        title="Owner Dashboard"
        subTitle="View insights like total cars, bookings, and revenue"
      />

      {/* Summary Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8'>
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className='bg-white border border-bordorColor p-5 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-between'
          >
            <div>
              <p className='text-gray-500 text-sm'>{card.title}</p>
              <h2 className='text-xl font-semibold text-gray-800 mt-1'>{card.value}</h2>
            </div>
            <div className='bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center'>
              <img src={card.icon} alt="" className='w-5 h-5' />
            </div>
          </div>
        ))}
      </div>

      {/* Revenue & Recent Bookings */}
      <div className='flex flex-col lg:flex-row gap-6 mb-10'>
        {/* Recent Bookings */}
        <div className='w-full lg:w-2/3 bg-white border border-bordorColor p-6 rounded-2xl shadow'>
          <h2 className='text-lg font-semibold text-gray-800 mb-1'>Recent Bookings</h2>
          <p className='text-sm text-gray-500 mb-4'>Latest customer activity</p>

          {data?.recentBookings?.length > 0 ? (
            data.recentBookings.map((booking, index) => (
              <div key={index} className='flex items-center justify-between py-3 border-b last:border-none'>
                <div className='flex items-center gap-3'>
                  <img src={assets.listIconColored} alt="" className='h-5 w-5' />
                  <div>
                    <p className='text-sm font-medium text-gray-700'>
                      {booking?.car?.brand} {booking?.car?.model}
                    </p>
                    <p className='text-xs text-gray-500'>
                      {booking?.createdAt?.split('T')[0] || "Unknown date"}
                    </p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='text-sm text-gray-700 font-medium'>
                    {currency} {booking?.price || 0}
                  </p>
                  <span className='text-xs inline-block px-2 py-0.5 border rounded-full bg-gray-100 border-gray-300 text-gray-600'>
                    {booking?.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className='text-gray-500'>No recent bookings.</p>
          )}
        </div>

        {/* Monthly Revenue */}
        <div className='w-full lg:w-1/3 bg-white border border-bordorColor p-6 rounded-2xl shadow'>
          <h2 className='text-lg font-semibold text-gray-800 mb-1'>Monthly Revenue</h2>
          <p className='text-sm text-gray-500'>Earnings for the current month</p>
          <div className='mt-6 text-4xl font-bold text-primary'>
            {currency} {data?.monthlyRevenue || 0}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
