'use client'

import { useState } from 'react'
import { Layout } from '@/components/Layout'
import { getChaosState, simulateNetworkDelay } from '@/lib/chaos'
import { Modal } from '@/components/traps/Modal'
import { ToastContainer } from '@/components/traps/Toast'
import { Spinner } from '@/components/traps/Spinner'

type FormStep = 1 | 2 | 3

export function FormsPage() {
  const [currentStep, setCurrentStep] = useState<FormStep>(1)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    hasCompany: false,
    companyName: '',
    companyVAT: '',
    hasFile: false,
    file: null as File | null,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const validateStep = (step: FormStep): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.firstName) newErrors.firstName = 'Le prénom est requis'
      if (!formData.lastName) newErrors.lastName = 'Le nom est requis'
      if (!formData.email) {
        newErrors.email = 'L\'email est requis'
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email invalide'
      }
      if (!formData.phone) {
        newErrors.phone = 'Le téléphone est requis'
      } else if (!/^[0-9+\-\s()]+$/.test(formData.phone)) {
        newErrors.phone = 'Format de téléphone invalide'
      }
    }

    if (step === 2) {
      if (!formData.address) newErrors.address = 'L\'adresse est requise'
      if (!formData.city) newErrors.city = 'La ville est requise'
      if (!formData.postalCode) {
        newErrors.postalCode = 'Le code postal est requis'
      } else if (!/^\d{5}$/.test(formData.postalCode)) {
        newErrors.postalCode = 'Code postal invalide (5 chiffres)'
      }
      if (!formData.country) newErrors.country = 'Le pays est requis'
    }

    if (step === 3) {
      if (formData.hasCompany && !formData.companyName) {
        newErrors.companyName = 'Le nom de l\'entreprise est requis'
      }
      if (formData.hasCompany && formData.companyVAT && !/^[A-Z]{2}\d+$/.test(formData.companyVAT)) {
        newErrors.companyVAT = 'Format TVA invalide (ex: FR12345678901)'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((s) => Math.min(3, s + 1) as FormStep)
    }
  }

  const handlePrevious = () => {
    setCurrentStep((s) => Math.max(1, s - 1) as FormStep)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, file: 'Le fichier ne doit pas dépasser 5MB' })
        return
      }
      setFormData({ ...formData, file, hasFile: true })
      setErrors({ ...errors, file: '' })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(3)) return

    setIsSubmitting(true)
    const chaosState = getChaosState()

    try {
      await simulateNetworkDelay(chaosState.seed, chaosState, 1)
      // Simuler l'envoi du formulaire
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Erreur lors de la soumission', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8" data-testid="forms-title">
          Formulaire Multi-Étapes
        </h1>

        {/* Indicateur de progression */}
        <div className="mb-8" data-testid="form-progress">
          <div className="flex justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                  data-testid={`form-step-${step}`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span data-testid="form-step-label-1">Informations personnelles</span>
            <span data-testid="form-step-label-2">Adresse</span>
            <span data-testid="form-step-label-3">Entreprise & Fichier</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8" data-testid="multi-step-form">
          {/* Étape 1: Informations personnelles */}
          {currentStep === 1 && (
            <div className="space-y-4" data-testid="form-step-1-content">
              <h2 className="text-xl font-semibold mb-4" data-testid="step-1-title">
                Informations personnelles
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" data-testid="firstname-label">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    data-testid="firstname-input"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-600" data-testid="firstname-error">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" data-testid="lastname-label">
                    Nom *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    data-testid="lastname-input"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-600" data-testid="lastname-error">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" data-testid="email-label">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  data-testid="email-input"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600" data-testid="email-error">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" data-testid="phone-label">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+33 6 12 34 56 78"
                  data-testid="phone-input"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600" data-testid="phone-error">
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Étape 2: Adresse */}
          {currentStep === 2 && (
            <div className="space-y-4" data-testid="form-step-2-content">
              <h2 className="text-xl font-semibold mb-4" data-testid="step-2-title">
                Adresse
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" data-testid="address-label">
                  Adresse *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  data-testid="address-input"
                />
                {errors.address && (
                  <p className="mt-1 text-xs text-red-600" data-testid="address-error">
                    {errors.address}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" data-testid="city-label">
                    Ville *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    data-testid="city-input"
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-red-600" data-testid="city-error">
                      {errors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" data-testid="postalcode-label">
                    Code postal *
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.postalCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    maxLength={5}
                    data-testid="postalcode-input"
                  />
                  {errors.postalCode && (
                    <p className="mt-1 text-xs text-red-600" data-testid="postalcode-error">
                      {errors.postalCode}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" data-testid="country-label">
                  Pays *
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.country ? 'border-red-500' : 'border-gray-300'
                  }`}
                  data-testid="country-select"
                >
                  <option value="">Sélectionner un pays</option>
                  <option value="FR" data-testid="country-option-FR">France</option>
                  <option value="BE" data-testid="country-option-BE">Belgique</option>
                  <option value="CH" data-testid="country-option-CH">Suisse</option>
                </select>
                {errors.country && (
                  <p className="mt-1 text-xs text-red-600" data-testid="country-error">
                    {errors.country}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Étape 3: Entreprise & Fichier */}
          {currentStep === 3 && (
            <div className="space-y-4" data-testid="form-step-3-content">
              <h2 className="text-xl font-semibold mb-4" data-testid="step-3-title">
                Informations complémentaires
              </h2>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.hasCompany}
                    onChange={(e) => setFormData({ ...formData, hasCompany: e.target.checked })}
                    className="w-4 h-4"
                    data-testid="has-company-checkbox"
                  />
                  <span className="text-sm font-medium text-gray-700" data-testid="has-company-label">
                    J&apos;ai une entreprise
                  </span>
                </label>
              </div>

              {formData.hasCompany && (
                <div className="space-y-4 pl-6 border-l-2 border-blue-200" data-testid="company-fields">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" data-testid="company-name-label">
                      Nom de l&apos;entreprise *
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-md ${
                        errors.companyName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      data-testid="company-name-input"
                    />
                    {errors.companyName && (
                      <p className="mt-1 text-xs text-red-600" data-testid="company-name-error">
                        {errors.companyName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" data-testid="company-vat-label">
                      Numéro TVA (optionnel)
                    </label>
                    <input
                      type="text"
                      value={formData.companyVAT}
                      onChange={(e) => setFormData({ ...formData, companyVAT: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-md ${
                        errors.companyVAT ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="FR12345678901"
                      data-testid="company-vat-input"
                    />
                    {errors.companyVAT && (
                      <p className="mt-1 text-xs text-red-600" data-testid="company-vat-error">
                        {errors.companyVAT}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" data-testid="file-label">
                  Joindre un fichier (optionnel, max 5MB)
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  data-testid="file-input"
                />
                {formData.file && (
                  <p className="mt-1 text-xs text-gray-600" data-testid="file-name">
                    Fichier sélectionné: {formData.file.name}
                  </p>
                )}
                {errors.file && (
                  <p className="mt-1 text-xs text-red-600" data-testid="file-error">
                    {errors.file}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Boutons de navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="form-previous"
            >
              Précédent
            </button>
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                data-testid="form-next"
              >
                Suivant
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                data-testid="form-submit"
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" seed={getChaosState().seed} index={1} />
                    <span className="ml-2">Envoi...</span>
                  </>
                ) : (
                  'Envoyer'
                )}
              </button>
            )}
          </div>
        </form>
      </div>

      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Formulaire envoyé"
        seed={getChaosState().seed}
        index={2}
      >
        <p className="text-gray-600" data-testid="form-success-message">
          Votre formulaire a été envoyé avec succès !
        </p>
      </Modal>

      <ToastContainer seed={getChaosState().seed} />
    </Layout>
  )
}
