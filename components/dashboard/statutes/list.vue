<template>
  <div class="my-6">
    <!-- breadcrumb -->
    <div class="flex gap-5 items-center">
      <span class="w-5 h-5 bg-[#DDC524]"></span>
      <span class="font-medium text-lg">Statutes &amp; Rules</span>
    </div>
    <!-- content -->
    <div class="bg-white rounded-lg">
      <div class="flex justify-between items-center my-5 p-5 md:py-10">
        <div></div>
        <div
          class="rounded-md border-[1px] border-[#babcd4] flex flex-col md:flex-row w-full md:w-fit gap-3 p-1.5"
        >
          <button
            type="button"
            class="py-2 px-8 flex justify-center items-center gap-2 rounded-md border[1px] border-[#08085E] font-medium hover:bg-[#3939A2] hover:text-[#fff] transition-all text-sm"
            :class="
              buttonStates.statutes
                ? 'bg-[#08085E] text-[#fff]'
                : 'bg-[#fff] text-[#08085E]'
            "
            @click.prevent="toggleButton('statutes', true)"
          >
            Statutes
          </button>
          <button
            type="button"
            class="py-2 px-8 flex justify-center items-center gap-2 rounded-md border[1px] border-[#08085E] font-medium hover:bg-[#3939A2] hover:text-[#fff] transition-all text-sm"
            :class="
              buttonStates.laws
                ? 'bg-[#08085E] text-[#fff]'
                : 'bg-[#fff] text-[#08085E]'
            "
            @click.prevent="toggleButton('laws', true)"
          >
            Laws of States
          </button>
          <button
            type="button"
            class="py-2 px-8 flex justify-center items-center gap-2 rounded-md border[1px] border-[#08085E] font-medium hover:bg-[#3939A2] hover:text-[#fff] transition-all text-sm"
            :class="
              buttonStates.rules
                ? 'bg-[#08085E] text-[#fff]'
                : 'bg-[#fff] text-[#08085E]'
            "
            @click.prevent="toggleButton('rules', true)"
          >
            Rules of Courts
          </button>
        </div>
        <div></div>
      </div>

      <!-- saved case -->
      <div class="w-full flex justify-center items-center">
        <dashboard-statutes-statute
          v-if="buttonStates.statutes"
          :statutes="ACT"
          @trigger-open-doc="openModal"
        />
        <dashboard-statutes-laws
          v-if="buttonStates.laws"
          :laws="LAW"
          @trigger-open-doc="openModal"
        />
        <dashboard-statutes-rules
          v-if="buttonStates.rules"
          :rules="RULES"
          @trigger-open-doc="openModal"
        />
      </div>

      <utils-modal @close="toggleModal" v-if="modalState">
        <template v-slot:header>
          <span class="flex gap-4 items-center cursor-pointer">
            <utils-svg-loader
              icon="filter-icon"
              class="cursor-pointer"
              color="#08085E"
            />
            <span class="font-medium text-[#08085E]">Statutes &amp; Rules</span>
          </span>
        </template>

        <!-- Body slot -->
        <template v-slot:body>
          <div>
            <!-- <iframe
              :src="`https://drive.google.com/viewerng/viewer?embedded=true&url=${ selectedPdfUrl }`"
              width="100%"
              height="500px"
            ></iframe> -->

            <utils-pdf-viewer :pdfSrc="selectedPdfUrl" />
          </div>
        </template>
      </utils-modal>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      buttonStates: {
        statutes: true,
        laws: false,
        rules: false,
      },
      modalState: false,
      selectedPdfUrl: null,
      ACT: [
        {
          id: 'SR002',
          title: 'Administration Of Criminal Justice Act ',
          year: 2015,
        },
        {
          id: 'SR005',
          title:
            'Asset Management Corporation Of Nigeria (Amendment No.2) Act ',
          year: 2019,
        },
        {
          id: 'SR006',
          title: 'Banks And Other Financial Institutions Act  ',
          year: 2004,
        },
        {
          id: 'SR009',
          title: 'Constitution Of The Federal Republic Of Nigeria ',
          year: 1999,
        },
        {
          id: 'SR010',
          title:
            'Constitution Of The Federal Republic Of Nigeria (Second Alteration) Act',
          year: 2010,
        },
        {
          id: 'SR011',
          title:
            'Constitution Of The Federal Republic Of Nigeria (Third Alteration) Act',
          year: 2010,
        },
        {
          id: 'SR015',
          title: 'Cybercrimes (Prohibition, Prevention, Etc) Act',
          year: 2015,
        },
        {
          id: 'SR017',
          title: 'Evidence Act',
          year: 2011,
        },
        {
          id: 'SR026',
          title: 'Land Use Act ',
          year: 1978,
        },
        {
          id: 'SR030',
          title: 'Nigerian Investment Promotion Commission Act',
          year: 2004,
        },
        {
          id: 'SR034',
          title: 'Stamp Duties Act ',
          year: 2004,
        },
        {
          id: 'SR039',
          title: 'Companies and Allied Matters Act',
          year: 2020,
        },
        {
          id: 'SR040',
          title: 'Finance Act',
          year: 2020,
        },

        // law as statutes
        {
          id: 'SR033',
          title: 'Rules Of Professional Conduct For Legal Practitioners ',
          year: 2007,
        },
        {
          id: 'SR041',
          title: 'Admiralty Jurisdiction Act, Cap. A5 L.F.N. 2004',
          year: 2004,
        },
        {
          id: 'SR042',
          title: 'Advance Fee Fraud And Other Fraud Related Offences Act, 2006',
          year: 2006,
        },
        {
          id: 'SR043',
          title:
            'African Charter On Human And Peoples\u2019 Rights (Ratification And Enforcement) Act, Cap. A9 L.F.N. 2004',
          year: 2004,
        },
        {
          id: 'SR044',
          title: 'Arbitration And Conciliation Act, Cap A18 L.F.N 2004',
          year: 2004,
        },
        {
          id: 'SR045',
          title: 'Armed Forces Act, Cap. A20 L.F.N 2004',
          year: 2004,
        },
        {
          id: 'SR046',
          title: 'Asset Management Corporation Of Nigeria Act, 2019',
          year: 2019,
        },
        {
          id: 'SR047',
          title: 'Carriage Of Goods By Sea Act, Cap C2 L.F.N 2004',
          year: 2004,
        },
        {
          id: 'SR048',
          title: 'Central Bank Of Nigeria Act, 2007',
          year: 2007,
        },
        {
          id: 'SR049',
          title: 'Child\u2019s Right Act, 2015',
          year: 2015,
        },
        {
          id: 'SR050',
          title: 'Code Of Conduct Bureau And Tribunal Act, Cap C15 L.F.N 2004',
          year: 2004,
        },
        {
          id: 'SR051',
          title: 'Companies Income Tax Act, Cap C21 L.F.N. 2004',
          year: 2004,
        },
        {
          id: 'SR052',
          title:
            'Corrupt Practices And Other Related Offences Act, Cap. C31 LFN 2004',
          year: 2004,
        },
        {
          id: 'SR053',
          title: 'Court Of Appeal Act, Cap C36 L.F.N 2004',
          year: 2004,
        },
        {
          id: 'SR054',
          title: 'Criminal Code Act, Cap C38 L.F.N 2004',
          year: 2004,
        },
        {
          id: 'SR055',
          title:
            'Criminal Procedure (Northern States) Act, Cap. C42 L.F.N 2004',
          year: 2004,
        },
        {
          id: 'SR056',
          title: 'Criminal Procedure Act, Cap C41 L.F.N. 2004',
          year: 2004,
        },
        {
          id: 'SR057',
          title: 'Dishonoured Cheques (Offences) Act, Cap. D11, LFN 2004',
          year: 2004,
        },
        {
          id: 'SR058',
          title:
            'Economic And Financial Crimes Commission (Establishment, Etc.) Act, Cap. E1 L.F.N. 2004',
          year: 2004,
        },
        {
          id: 'SR059',
          title: 'Electoral Act 2010',
          year: 2010,
        },
        {
          id: 'SR060',
          title: 'Employees Compensation Act, 2010',
          year: 2010,
        },
        {
          id: 'SR061',
          title: 'Evidence Act, 2011',
          year: 2011,
        },
        {
          id: 'SR062',
          title:
            'Failed Banks (Recovery Of Debts) And Financial Malpractices In Banks Act, Cap. F2 L.F.N. 2004',
          year: 2004,
        },
        {
          id: 'SR063',
          title: 'Federal High Court Act, Cap. F12 L.F.N. 2004',
          year: 2004,
        },
        {
          id: 'SR064',
          title: 'Firearms Act,  Cap. F28 L.F.N. 2004',
          year: 2004,
        },
        {
          id: 'SR065',
          title:
            'Foreign Judgments (Reciprocal Enforcement) Act,  Cap. F34 L.F.N. 2004 ',
          year: 2004,
        },
        {
          id: 'SR066',
          title: 'Freedom Of Information Act, 2011 ',
          year: 2011,
        },
        {
          id: 'SR067',
          title: 'Immigration Act, 2015',
          year: 2015,
        },
        {
          id: 'SR068',
          title: 'Insurance Act, Cap I17 L.F.N 2004',
          year: 2004,
        },
        {
          id: 'SR069',
          title: 'Interpretation Act, I23 LFN 2004',
          year: 2004,
        },
        {
          id: 'SR070',
          title: 'Investments And Securities Act, 2007',
          year: 2007,
        },
        {
          id: 'SR071',
          title: 'Labour Act, Cap. L1 L.F.N. 2004',
          year: 2004,
        },
        {
          id: 'SR072',
          title: 'Legal Practitioners Act, Cap. L11 L.F.N. 2004',
          year: 2004,
        },
        {
          id: 'SR073',
          title: 'Marriage Act, Cap. M6 L.F.N. 2004',
          year: 2004,
        },
        {
          id: 'SR074',
          title: 'Matrimonial Causes Act, Cap. M7 L.F.N. 2004',
          year: 2004,
        },
        {
          id: 'SR075',
          title: 'Medical And Dental Practitioners Act, Cap.M8, LFN 2004',
          year: 2004,
        },
        {
          id: 'SR076',
          title: 'Money Laundering (Prohibition) Act, 2011',
          year: 2011,
        },
        {
          id: 'SR077',
          title:
            'National Agency For Food And Drug Administration And Control Act, Cap. N1 L.F.N. 2004',
          year: 2004,
        },
        {
          id: 'SR078',
          title: 'National Deposit Insurance Corporation Act, 2006',
          year: 2006,
        },
        {
          id: 'SR079',
          title:
            'National Drug Law Enforcement Agency Act, Cap. N30 L.F.N 2004',
          year: 2004,
        },
        {
          id: 'SR080',
          title: 'National Human Right Commission Act, Cap. N46, LFN 2004',
          year: 2004,
        },
        {
          id: 'SR081',
          title: 'National Industrial Court Act, 2006',
          year: 2006,
        },
        {
          id: 'SR082',
          title: 'Oaths Act, Cap. O1, LFN 2004',
          year: 2004,
        },
        // {
        //   id: 'SR083',
        //   title:
        //     'Penal Code (Northern States) Federal Provisions Act, Cap. P3 L.F.N. 2004',
        //   year: 2004,
        // },
        {
          id: 'SR084',
          title: 'Pension Reform Act, 2014',
          year: 2014,
        },
        {
          id: 'SR085',
          title: 'Personal Income Tax Act, Cap. P8, LFN 2004',
          year: 2004,
        },
        {
          id: 'SR086',
          title: 'Petroleum Act, Cap. P10, LFN 2004',
          year: 2004,
        },
        {
          id: 'SR087',
          title: 'Police Act, Cap. P19 L.F.N 2004',
          year: 2004,
        },
        {
          id: 'SR088',
          title: 'Public Officers Protection Act, Cap. P41 L.F.N. 2004',
          year: 2004,
        },
        {
          id: 'SR089',
          title:
            'Robbery And Firearms (Special Provisions) Act, Cap. R11 L.F.N. 2004',
          year: 2004,
        },
        {
          id: 'SR090',
          title: 'Sheriffs And Civil Process Act, Cap. S6 L.F.N. 2004',
          year: 2004,
        },
        {
          id: 'SR091',
          title: 'Supreme Court Act, Cap. S15 L.F.N. 2004',
          year: 2004,
        },
        {
          id: 'SR093',
          title:
            'Taxes And Levies (Approved List For Collection) Act, Cap. T2, LFN 2004',
          year: 2004,
        },
        {
          id: 'SR094',
          title: 'Terrorism (Prevention) Act, 2011',
          year: 2011,
        },
        {
          id: 'SR095',
          title: 'Trade Disputes Act, Cap. T8 L.F.N. 2004',
          year: 2004,
        },
        {
          id: 'SR096',
          title: 'Trade Marks Act, Cap. T13, LFN 2004',
          year: 2004,
        },
        {
          id: 'SR097',
          title: 'Trade Unions Act, Cap. T14, LFN 2004',
          year: 2004,
        },
        {
          id: 'SR098',
          title: 'Value Added Tax Act, Cap. V1, LFN 2004',
          year: 2004,
        },
        {
          id: 'SR099',
          title: 'Electoral Act, 2022',
          year: 2022,
        },
      ],
      LAW: [
        {
          id: 'SR025',
          title: 'Lagos State Traffic Management Authority Law ',
          year: 2008,
        },
      ],
      RULES: [
        {
          id: 'SR013',
          title: 'Court Of Appeal Rules',
          year: 2016,
        },
        {
          id: 'SR019',
          title: 'FCT High Court (Civil Procedure) Rules',
          year: 2018,
        },
        {
          id: 'SR020',
          title: 'Federal High Court (Civil Procedure) Rules',
          year: 2019,
        },
        {
          id: 'SR021',
          title: 'Fundamental Rights (Enforcement Procedure) Rules',
          year: 2009,
        },
        {
          id: 'SR023',
          title: 'High Court Of Lagos State (Civil Procedure) Rules ',
          year: 2019,
        },
        {
          id: 'SR024',
          title: 'High Court Of Rivers State Practice Directions ',
          year: 2020,
        },
        {
          id: 'SR028',
          title: 'National Bar Association Constitution (As Amended) ',
          year: 2015,
        },
        {
          id: 'SR029',
          title: 'National Industrial Court Of Nigeria (Civil Procedure) Rules',
          year: 2017,
        },
        {
          id: 'SR038',
          title: 'Legal Practitioners Disciplinary Committee Rules',
          year: 2020,
        },
        {
          id: 'SR092',
          title: 'Supreme Court Rules, 1985',
          year: 1985,
        },
      ],
    }
  },
  methods: {
    toggleButton(key, status = null) {
      for (const key in this.buttonStates) {
        if (this.buttonStates.hasOwnProperty(key)) {
          this.buttonStates[key] = false
        }
      }
      this.buttonStates[key] =
        status === null ? !this.buttonStates[key] : status
    },
    toggleModal() {
      this.modalState = !this.modalState
    },
    openModal(url) {
      this.selectedPdfUrl = url
      this.toggleModal()
    },
  },
  mounted() {},
}
</script>
