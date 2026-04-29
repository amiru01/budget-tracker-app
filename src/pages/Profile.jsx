import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCurrency } from '../context/CurrencyContext.jsx'
import { logout } from '../services/authService.js'
import useFinanceData from '../hooks/useFinanceData.js'

function formatDate(date) {
  if (!date) return 'N/A'
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function Profile() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { currency, setCurrency: setGlobalCurrency, formatCurrency } = useCurrency()
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)
  const [showDeleteModal, setShowDeleteModal] = React.useState(false)
  const [theme, setTheme] = React.useState('light')
  const [notifications, setNotifications] = React.useState(true)

  const {
    incomes,
    expenses,
    totalIncome,
    totalExpenses,
    balance,
    loading,
  } = useFinanceData()

  // Calculate stats
  const totalTransactions = incomes.length + expenses.length
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0

  // Get user metadata
  const userEmail = user?.email || 'No email'
  const userName = user?.displayName || user?.email?.split('@')[0] || 'User'
  const userPhoto = user?.photoURL || null
  const joinDate = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime)
    : null

  async function handleLogout() {
    if (!confirm('Are you sure you want to logout?')) return

    setIsLoggingOut(true)
    try {
      await logout()
      navigate('/login')
    } catch (err) {
      alert(err?.message || 'Failed to logout')
      setIsLoggingOut(false)
    }
  }

  function handleDeleteAccount() {
    setShowDeleteModal(true)
  }

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4 py-10">
        <div className="rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
          Loading profile…
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <p className="text-sm font-medium text-slate-500">Smart Finance</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Profile & Settings
        </h1>
      </header>

      {/* User Info Card */}
      <section className="mx-auto max-w-2xl">
        <article className="rounded-2xl bg-gradient-to-br from-blue-50 to-white p-8 shadow-md ring-1 ring-blue-200">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              {userPhoto ? (
                <img
                  src={userPhoto}
                  alt={userName}
                  className="h-24 w-24 rounded-full ring-4 ring-white shadow-lg object-cover"
                />
              ) : (
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userEmail || userName)}&backgroundColor=b6e3f4,c0aede,d1d4f9`}
                  alt={userName}
                  className="h-24 w-24 rounded-full bg-white ring-4 ring-white shadow-lg"
                />
              )}
            </div>

            {/* User Details */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-slate-900">{userName}</h2>
              <p className="mt-1 text-sm text-slate-600">{userEmail}</p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  <span>👤</span>
                  <span>Free Account</span>
                </span>
                {joinDate && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    <span>📅</span>
                    <span>Joined {formatDate(joinDate)}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </article>
      </section>

      {/* Account Stats */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900">Account Overview</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-xl bg-white p-6 shadow-md ring-1 ring-slate-200 transition hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Income</p>
                <p className="mt-2 text-2xl font-bold text-emerald-600">
                  {formatCurrency(totalIncome)}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-2xl">
                💰
              </div>
            </div>
          </article>

          <article className="rounded-xl bg-white p-6 shadow-md ring-1 ring-slate-200 transition hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Expenses</p>
                <p className="mt-2 text-2xl font-bold text-rose-600">
                  {formatCurrency(totalExpenses)}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-2xl">
                💸
              </div>
            </div>
          </article>

          <article className="rounded-xl bg-white p-6 shadow-md ring-1 ring-slate-200 transition hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Transactions</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{totalTransactions}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                📊
              </div>
            </div>
          </article>

          <article className="rounded-xl bg-white p-6 shadow-md ring-1 ring-slate-200 transition hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Savings Rate</p>
                <p
                  className={[
                    'mt-2 text-2xl font-bold',
                    savingsRate >= 20
                      ? 'text-emerald-600'
                      : savingsRate >= 10
                      ? 'text-amber-600'
                      : 'text-rose-600',
                  ].join(' ')}
                >
                  {savingsRate.toFixed(1)}%
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl">
                📈
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Settings Section */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* General Settings */}
        <article className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">General Settings</h2>
          <p className="mt-1 text-sm text-slate-500">Manage your app preferences</p>

          <div className="mt-6 space-y-4">
            {/* Currency Selector */}
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div>
                <p className="text-sm font-semibold text-slate-900">Currency</p>
                <p className="mt-0.5 text-xs text-slate-600">Choose your preferred currency</p>
              </div>
              <select
                value={currency}
                onChange={(e) => setGlobalCurrency(e.target.value)}
                className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="AED">AED - UAE Dirham (د.إ)</option>
                <option value="AFN">AFN - Afghan Afghani (؋)</option>
                <option value="ALL">ALL - Albanian Lek (L)</option>
                <option value="AMD">AMD - Armenian Dram (֏)</option>
                <option value="ANG">ANG - Netherlands Antillean Guilder (ƒ)</option>
                <option value="AOA">AOA - Angolan Kwanza (Kz)</option>
                <option value="ARS">ARS - Argentine Peso ($)</option>
                <option value="AUD">AUD - Australian Dollar ($)</option>
                <option value="AWG">AWG - Aruban Florin (ƒ)</option>
                <option value="AZN">AZN - Azerbaijani Manat (₼)</option>
                <option value="BAM">BAM - Bosnia-Herzegovina Convertible Mark (KM)</option>
                <option value="BBD">BBD - Barbadian Dollar ($)</option>
                <option value="BDT">BDT - Bangladeshi Taka (৳)</option>
                <option value="BGN">BGN - Bulgarian Lev (лв)</option>
                <option value="BHD">BHD - Bahraini Dinar (.د.ب)</option>
                <option value="BIF">BIF - Burundian Franc (Fr)</option>
                <option value="BMD">BMD - Bermudian Dollar ($)</option>
                <option value="BND">BND - Brunei Dollar ($)</option>
                <option value="BOB">BOB - Bolivian Boliviano (Bs.)</option>
                <option value="BRL">BRL - Brazilian Real (R$)</option>
                <option value="BSD">BSD - Bahamian Dollar ($)</option>
                <option value="BTC">BTC - Bitcoin (₿)</option>
                <option value="BTN">BTN - Bhutanese Ngultrum (Nu.)</option>
                <option value="BWP">BWP - Botswanan Pula (P)</option>
                <option value="BYN">BYN - Belarusian Ruble (Br)</option>
                <option value="BZD">BZD - Belize Dollar ($)</option>
                <option value="CAD">CAD - Canadian Dollar ($)</option>
                <option value="CDF">CDF - Congolese Franc (Fr)</option>
                <option value="CHF">CHF - Swiss Franc (Fr)</option>
                <option value="CLP">CLP - Chilean Peso ($)</option>
                <option value="CNY">CNY - Chinese Yuan (¥)</option>
                <option value="COP">COP - Colombian Peso ($)</option>
                <option value="CRC">CRC - Costa Rican Colón (₡)</option>
                <option value="CUP">CUP - Cuban Peso ($)</option>
                <option value="CVE">CVE - Cape Verdean Escudo ($)</option>
                <option value="CZK">CZK - Czech Koruna (Kč)</option>
                <option value="DJF">DJF - Djiboutian Franc (Fr)</option>
                <option value="DKK">DKK - Danish Krone (kr)</option>
                <option value="DOP">DOP - Dominican Peso ($)</option>
                <option value="DZD">DZD - Algerian Dinar (د.ج)</option>
                <option value="EGP">EGP - Egyptian Pound (£)</option>
                <option value="ERN">ERN - Eritrean Nakfa (Nfk)</option>
                <option value="ETB">ETB - Ethiopian Birr (Br)</option>
                <option value="ETH">ETH - Ethereum (Ξ)</option>
                <option value="EUR">EUR - Euro (€)</option>
                <option value="FJD">FJD - Fijian Dollar ($)</option>
                <option value="FKP">FKP - Falkland Islands Pound (£)</option>
                <option value="GBP">GBP - British Pound (£)</option>
                <option value="GEL">GEL - Georgian Lari (₾)</option>
                <option value="GGP">GGP - Guernsey Pound (£)</option>
                <option value="GHS">GHS - Ghanaian Cedi (₵)</option>
                <option value="GIP">GIP - Gibraltar Pound (£)</option>
                <option value="GMD">GMD - Gambian Dalasi (D)</option>
                <option value="GNF">GNF - Guinean Franc (Fr)</option>
                <option value="GTQ">GTQ - Guatemalan Quetzal (Q)</option>
                <option value="GYD">GYD - Guyanese Dollar ($)</option>
                <option value="HKD">HKD - Hong Kong Dollar ($)</option>
                <option value="HNL">HNL - Honduran Lempira (L)</option>
                <option value="HRK">HRK - Croatian Kuna (kn)</option>
                <option value="HTG">HTG - Haitian Gourde (G)</option>
                <option value="HUF">HUF - Hungarian Forint (Ft)</option>
                <option value="IDR">IDR - Indonesian Rupiah (Rp)</option>
                <option value="ILS">ILS - Israeli Shekel (₪)</option>
                <option value="IMP">IMP - Isle of Man Pound (£)</option>
                <option value="INR">INR - Indian Rupee (₹)</option>
                <option value="IQD">IQD - Iraqi Dinar (ع.د)</option>
                <option value="IRR">IRR - Iranian Rial (﷼)</option>
                <option value="ISK">ISK - Icelandic Króna (kr)</option>
                <option value="JEP">JEP - Jersey Pound (£)</option>
                <option value="JMD">JMD - Jamaican Dollar ($)</option>
                <option value="JOD">JOD - Jordanian Dinar (د.ا)</option>
                <option value="JPY">JPY - Japanese Yen (¥)</option>
                <option value="KES">KES - Kenyan Shilling (KSh)</option>
                <option value="KGS">KGS - Kyrgyzstani Som (с)</option>
                <option value="KHR">KHR - Cambodian Riel (៛)</option>
                <option value="KMF">KMF - Comorian Franc (Fr)</option>
                <option value="KPW">KPW - North Korean Won (₩)</option>
                <option value="KRW">KRW - South Korean Won (₩)</option>
                <option value="KWD">KWD - Kuwaiti Dinar (د.ك)</option>
                <option value="KYD">KYD - Cayman Islands Dollar ($)</option>
                <option value="KZT">KZT - Kazakhstani Tenge (₸)</option>
                <option value="LAK">LAK - Lao Kip (₭)</option>
                <option value="LBP">LBP - Lebanese Pound (ل.ل)</option>
                <option value="LKR">LKR - Sri Lankan Rupee (Rs)</option>
                <option value="LRD">LRD - Liberian Dollar ($)</option>
                <option value="LSL">LSL - Lesotho Loti (L)</option>
                <option value="LYD">LYD - Libyan Dinar (ل.د)</option>
                <option value="MAD">MAD - Moroccan Dirham (د.م.)</option>
                <option value="MDL">MDL - Moldovan Leu (L)</option>
                <option value="MGA">MGA - Malagasy Ariary (Ar)</option>
                <option value="MKD">MKD - Macedonian Denar (ден)</option>
                <option value="MMK">MMK - Myanmar Kyat (K)</option>
                <option value="MNT">MNT - Mongolian Tugrik (₮)</option>
                <option value="MOP">MOP - Macanese Pataca (P)</option>
                <option value="MRU">MRU - Mauritanian Ouguiya (UM)</option>
                <option value="MUR">MUR - Mauritian Rupee (₨)</option>
                <option value="MVR">MVR - Maldivian Rufiyaa (ރ.)</option>
                <option value="MWK">MWK - Malawian Kwacha (MK)</option>
                <option value="MXN">MXN - Mexican Peso ($)</option>
                <option value="MYR">MYR - Malaysian Ringgit (RM)</option>
                <option value="MZN">MZN - Mozambican Metical (MT)</option>
                <option value="NAD">NAD - Namibian Dollar ($)</option>
                <option value="NGN">NGN - Nigerian Naira (₦)</option>
                <option value="NIO">NIO - Nicaraguan Córdoba (C$)</option>
                <option value="NOK">NOK - Norwegian Krone (kr)</option>
                <option value="NPR">NPR - Nepalese Rupee (₨)</option>
                <option value="NZD">NZD - New Zealand Dollar ($)</option>
                <option value="OMR">OMR - Omani Rial (ر.ع.)</option>
                <option value="PAB">PAB - Panamanian Balboa (B/.)</option>
                <option value="PEN">PEN - Peruvian Sol (S/.)</option>
                <option value="PGK">PGK - Papua New Guinean Kina (K)</option>
                <option value="PHP">PHP - Philippine Peso (₱)</option>
                <option value="PKR">PKR - Pakistani Rupee (₨)</option>
                <option value="PLN">PLN - Polish Zloty (zł)</option>
                <option value="PYG">PYG - Paraguayan Guarani (₲)</option>
                <option value="QAR">QAR - Qatari Riyal (ر.ق)</option>
                <option value="RON">RON - Romanian Leu (lei)</option>
                <option value="RSD">RSD - Serbian Dinar (дин.)</option>
                <option value="RUB">RUB - Russian Ruble (₽)</option>
                <option value="RWF">RWF - Rwandan Franc (Fr)</option>
                <option value="SAR">SAR - Saudi Riyal (ر.س)</option>
                <option value="SBD">SBD - Solomon Islands Dollar ($)</option>
                <option value="SCR">SCR - Seychellois Rupee (₨)</option>
                <option value="SDG">SDG - Sudanese Pound (ج.س.)</option>
                <option value="SEK">SEK - Swedish Krona (kr)</option>
                <option value="SGD">SGD - Singapore Dollar ($)</option>
                <option value="SHP">SHP - Saint Helena Pound (£)</option>
                <option value="SLL">SLL - Sierra Leonean Leone (Le)</option>
                <option value="SOS">SOS - Somali Shilling (Sh)</option>
                <option value="SRD">SRD - Surinamese Dollar ($)</option>
                <option value="SSP">SSP - South Sudanese Pound (£)</option>
                <option value="STN">STN - São Tomé and Príncipe Dobra (Db)</option>
                <option value="SYP">SYP - Syrian Pound (£)</option>
                <option value="SZL">SZL - Swazi Lilangeni (L)</option>
                <option value="THB">THB - Thai Baht (฿)</option>
                <option value="TJS">TJS - Tajikistani Somoni (ЅМ)</option>
                <option value="TMT">TMT - Turkmenistani Manat (m)</option>
                <option value="TND">TND - Tunisian Dinar (د.ت)</option>
                <option value="TOP">TOP - Tongan Paʻanga (T$)</option>
                <option value="TRY">TRY - Turkish Lira (₺)</option>
                <option value="TTD">TTD - Trinidad and Tobago Dollar ($)</option>
                <option value="TWD">TWD - New Taiwan Dollar ($)</option>
                <option value="TZS">TZS - Tanzanian Shilling (Sh)</option>
                <option value="UAH">UAH - Ukrainian Hryvnia (₴)</option>
                <option value="UGX">UGX - Ugandan Shilling (Sh)</option>
                <option value="USD">USD - US Dollar ($)</option>
                <option value="UYU">UYU - Uruguayan Peso ($)</option>
                <option value="UZS">UZS - Uzbekistani Som (so'm)</option>
                <option value="VES">VES - Venezuelan Bolívar (Bs.)</option>
                <option value="VND">VND - Vietnamese Dong (₫)</option>
                <option value="VUV">VUV - Vanuatu Vatu (Vt)</option>
                <option value="WST">WST - Samoan Tala (T)</option>
                <option value="XAF">XAF - Central African CFA Franc (Fr)</option>
                <option value="XCD">XCD - East Caribbean Dollar ($)</option>
                <option value="XOF">XOF - West African CFA Franc (Fr)</option>
                <option value="XPF">XPF - CFP Franc (Fr)</option>
                <option value="YER">YER - Yemeni Rial (﷼)</option>
                <option value="ZAR">ZAR - South African Rand (R)</option>
                <option value="ZMW">ZMW - Zambian Kwacha (ZK)</option>
                <option value="ZWL">ZWL - Zimbabwean Dollar ($)</option>
              </select>
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div>
                <p className="text-sm font-semibold text-slate-900">Theme</p>
                <p className="mt-0.5 text-xs text-slate-600">Switch between light and dark mode</p>
              </div>
              <button
                type="button"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className={[
                  'relative inline-flex h-8 w-14 items-center rounded-full transition-colors',
                  theme === 'dark' ? 'bg-blue-600' : 'bg-slate-300',
                ].join(' ')}
              >
                <span
                  className={[
                    'inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform',
                    theme === 'dark' ? 'translate-x-7' : 'translate-x-1',
                  ].join(' ')}
                />
              </button>
            </div>

            {/* Notifications Toggle */}
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div>
                <p className="text-sm font-semibold text-slate-900">Notifications</p>
                <p className="mt-0.5 text-xs text-slate-600">Receive budget alerts and updates</p>
              </div>
              <button
                type="button"
                onClick={() => setNotifications(!notifications)}
                className={[
                  'relative inline-flex h-8 w-14 items-center rounded-full transition-colors',
                  notifications ? 'bg-emerald-600' : 'bg-slate-300',
                ].join(' ')}
              >
                <span
                  className={[
                    'inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform',
                    notifications ? 'translate-x-7' : 'translate-x-1',
                  ].join(' ')}
                />
              </button>
            </div>
          </div>
        </article>

        {/* Account Actions */}
        <article className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Account Actions</h2>
          <p className="mt-1 text-sm text-slate-500">Manage your account</p>

          <div className="mt-6 space-y-4">
            {/* Export Data */}
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="w-full rounded-xl bg-blue-50 px-4 py-3 text-left transition hover:bg-blue-100"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-xl">
                  📥
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Export Data</p>
                  <p className="mt-0.5 text-xs text-slate-600">
                    Download your financial data as CSV
                  </p>
                </div>
              </div>
            </button>

            {/* View Reports */}
            <button
              type="button"
              onClick={() => navigate('/reports')}
              className="w-full rounded-xl bg-purple-50 px-4 py-3 text-left transition hover:bg-purple-100"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-xl">
                  📊
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">View Reports</p>
                  <p className="mt-0.5 text-xs text-slate-600">
                    See detailed financial analytics
                  </p>
                </div>
              </div>
            </button>

            {/* Manage Budget Rules */}
            <button
              type="button"
              onClick={() => navigate('/budgets')}
              className="w-full rounded-xl bg-emerald-50 px-4 py-3 text-left transition hover:bg-emerald-100"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-xl">
                  💰
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Budget Rules</p>
                  <p className="mt-0.5 text-xs text-slate-600">
                    Create and manage spending limits
                  </p>
                </div>
              </div>
            </button>
          </div>
        </article>
      </section>

      {/* Danger Zone */}
      <section className="rounded-2xl bg-rose-50 p-6 shadow-md ring-1 ring-rose-200">
        <h2 className="text-lg font-semibold text-rose-900">Danger Zone</h2>
        <p className="mt-1 text-sm text-rose-700">
          Irreversible actions that affect your account
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex-1 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-slate-300 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>

          <button
            type="button"
            onClick={handleDeleteAccount}
            className="flex-1 rounded-xl bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"
          >
            Delete Account
          </button>
        </div>
      </section>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <button
            type="button"
            onClick={() => setShowDeleteModal(false)}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            aria-label="Close modal"
          />

          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-3xl">
                ⚠️
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-900">Delete Account</h3>
              <p className="mt-2 text-sm text-slate-600">
                This action cannot be undone. All your financial data, transactions, and settings
                will be permanently deleted.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert('Account deletion is not implemented yet. This is a UI placeholder.')
                    setShowDeleteModal(false)
                  }}
                  className="flex-1 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
                >
                  Delete Forever
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
