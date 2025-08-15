<template>
  <div class="paybills-container">
    <div class="paybills-header">
      <i class="bi bi-credit-card"></i>
      <span>Pay Bills</span>
    </div>

    <div class="paybills-body">
      <table class="paybills-table">
        <thead>
          <tr>
            <th>Bill #</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="bill in bills" :key="bill.id">
            <td>{{ bill.id }}</td>
            <td>{{ bill.date }}</td>
            <td>Rs: {{ bill.amount }}</td>
            <td>
              <span
                :class="['paybills-badge', bill.paid ? 'paid' : 'unpaid']"
                :aria-label="bill.paid ? 'Paid' : 'Unpaid'"
              >
                {{ bill.paid ? "Paid" : "Unpaid" }}
              </span>
            </td>
            <td>
              <button
                v-if="!bill.paid"
                class="paybills-btn"
                @click="payBill(bill.id)"
                :aria-label="'Pay bill ' + bill.id"
              >
                <i class="bi bi-cash-coin"></i> Pay Now
              </button>
              <span v-else class="paybills-paid-text">
                <i class="bi bi-check-circle"></i> Paid
              </span>
            </td>
          </tr>
          <tr v-if="bills.length === 0">
            <td colspan="5" class="paybills-empty-row">
              No bills found.
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="successMsg" class="paybills-success" role="status">
        <i class="bi bi-check-circle"></i> {{ successMsg }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PayBills",
  data() {
    return {
      bills: [
        { id: 101, date: "2025-08-01", amount: 1200, paid: false },
        { id: 102, date: "2025-07-15", amount: 800, paid: true },
        { id: 103, date: "2025-07-10", amount: 500, paid: false }
      ],
      successMsg: ""
    };
  },
  methods: {
    payBill(id) {
      const bill = this.bills.find(b => b.id === id);
      if (bill && !bill.paid) {
        bill.paid = true;
        this.successMsg = "Bill #" + id + " paid successfully!";
        this.$emit("bill-paid", id);
        setTimeout(() => {
          this.successMsg = "";
        }, 2000);
      }
    }
  }
};
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");

.paybills-container {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #e0f2fe 0%, #f8fafc 100%);
  padding: 2rem;
  box-sizing: border-box;
}

.paybills-header {
  background: linear-gradient(90deg, #2563eb 0%, #38bdf8 100%);
  color: #fff;
  border-radius: 1rem 1rem 0 0;
  padding: 1rem 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.7rem;
}

.paybills-body {
  width: 100%;
  background: #fff;
  border-radius: 0 0 1rem 1rem;
  box-shadow: 0 8px 32px rgba(30, 58, 138, 0.13);
  overflow-x: auto;
}

.paybills-table {
  width: 100%;
  border-collapse: collapse;
}

.paybills-table th,
.paybills-table td {
  padding: 1rem 0.7rem;
  text-align: left;
  font-size: 1rem;
  vertical-align: middle;
}

.paybills-table th {
  background: #bae6fd;
  color: #2563eb;
  font-weight: 600;
  border-bottom: 2px solid #38bdf8;
}

.paybills-table tr:not(:last-child) td {
  border-bottom: 1px solid #bae6fd;
}

.paybills-badge {
  border-radius: 0.6rem;
  padding: 0.4rem 0.9rem;
  font-size: 0.95rem;
  font-weight: 500;
  display: inline-block;
  color: #fff;
  min-width: 70px;
  text-align: center;
}
.paybills-badge.paid {
  background: #10b981;
}
.paybills-badge.unpaid {
  background: #f59e0b;
}

.paybills-btn {
  background: linear-gradient(90deg, #2563eb 0%, #38bdf8 100%);
  color: #fff;
  border: none;
  border-radius: 0.7rem;
  padding: 0.5rem 1.1rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(30, 58, 138, 0.07);
  transition: background 0.2s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.paybills-btn:hover {
  background: linear-gradient(90deg, #38bdf8 0%, #2563eb 100%);
  box-shadow: 0 4px 16px rgba(30, 58, 138, 0.13);
}

.paybills-paid-text {
  color: #10b981;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.paybills-empty-row {
  text-align: center;
  color: #64748b;
  font-size: 1.05rem;
  padding: 2rem 0;
}

.paybills-success {
  margin: 1.2rem auto;
  color: #10b981;
  font-weight: 600;
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  background: #f0fdf4;
  border-radius: 0.7rem;
  padding: 0.7rem;
  box-shadow: 0 1px 4px rgba(34, 197, 94, 0.07);
}

@media (max-width: 900px) {
  .paybills-table th,
  .paybills-table td {
    font-size: 0.95rem;
    padding: 0.6rem 0.4rem;
  }
}
</style>
