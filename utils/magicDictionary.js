const ApplicationStatus = Object.freeze({
  DRAFT: 'draft',
  CONFIRMED: 'confirmed'
});

const stripeStatus = Object.freeze({
  PAID: 'paid'
})

module.exports = {
  ApplicationStatus,
  stripeStatus
}