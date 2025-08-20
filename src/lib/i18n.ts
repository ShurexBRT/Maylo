
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: { common: { search:'Search', anyBranch:'Any branch', anyCountry:'Any country', anyCity:'Any city', saved:'Saved Services' } },
  sr: { common: { search:'Pretraga', anyBranch:'Bilo koja branša', anyCountry:'Bilo koja država', anyCity:'Bilo koji grad', saved:'Sačuvane usluge' } }
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
})

export default i18n
