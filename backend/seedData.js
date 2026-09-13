import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import 'dotenv/config';
import userModel from './models/User.js';
import projectModel from './models/Project.js';
import leadModel from './models/Lead.js';

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('Error: MONGODB_URI is not defined in environment variables.');
    process.exit(1);
  }
  try {
    await mongoose.connect(mongoUri);
    console.log('✔ Connected to MongoDB successfully.');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

const seed = async () => {
  await connectDB();

  try {
    console.log('Starting CRM data seeding...');

    // 1. Prepare Users
    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('123456', salt);

    const usersData = [
      {
        name: 'Sakir Admin',
        email: 'sakir@gmail.com',
        number: 8511533885,
        password: defaultPassword,
        role: 'Admin',
        location: 'Bangalore',
        isCP: false,
      },
      {
        name: 'Sakir Manager',
        email: 'sakirmanager@gmail.com',
        number: 1234567890,
        password: defaultPassword,
        role: 'Manager',
        location: 'Bangalore',
        isCP: false,
      },
      {
        name: 'Sharmaji Manager',
        email: 'sarmaji@gmail.com',
        number: 7889654123,
        password: defaultPassword,
        role: 'Manager',
        location: 'Bangalore',
        isCP: false,
      },
      {
        name: 'Sakir Agent',
        email: 'sakiragent@gmail.com',
        number: 1234567895,
        password: defaultPassword,
        role: 'Agent',
        location: 'Bangalore',
        isCP: false,
      },
      {
        name: 'Priya Sharma',
        email: 'priya.sharma@example.com',
        number: 9876543210,
        password: defaultPassword,
        role: 'Agent',
        location: 'Bangalore',
        isCP: false,
      },
      {
        name: 'Rahul Nair',
        email: 'rahul.nair@example.com',
        number: 9876543211,
        password: defaultPassword,
        role: 'Agent',
        location: 'Bangalore',
        isCP: false,
      },
      {
        name: 'Sakir CP (Partner)',
        email: 'sam@gmail.com',
        number: 1234567899,
        password: defaultPassword,
        role: 'Channel Partner',
        location: 'Other',
        isCP: true,
      },
    ];

    const savedUsers = [];
    for (const u of usersData) {
      const existing = await userModel.findOne({ email: u.email });
      if (existing) {
        existing.name = u.name;
        existing.password = u.password;
        existing.role = u.role;
        existing.location = u.location;
        existing.isCP = u.isCP;
        await existing.save();
        savedUsers.push(existing);
      } else {
        const created = await userModel.create(u);
        savedUsers.push(created);
      }
    }
    console.log(`✔ Configured ${savedUsers.length} users with password: 123456`);

    const adminUser = savedUsers.find((u) => u.role === 'Admin');
    const agentUsers = savedUsers.filter((u) => u.role === 'Agent');
    const sakirAgent = savedUsers.find((u) => u.email === 'sakiragent@gmail.com');

    // 2. Prepare Projects
    const projectsData = [
      {
        name: 'Prestige Lakeside Habitat',
        description: 'Luxury 2, 3 & 4 BHK apartments & villas overlooking Varthur Lake, Whitefield.',
        status: 'Active',
        location: 'Bangalore',
        isMandateProject: true,
        assignedAgents: agentUsers.map((a) => a._id),
      },
      {
        name: 'DLF Cyber City Crest',
        description: 'Premium residences with world-class clubhouse & golf course views.',
        status: 'Active',
        location: 'NCR',
        isMandateProject: true,
        assignedAgents: [sakirAgent._id, agentUsers[1]._id],
      },
      {
        name: 'Godrej Woods',
        description: 'Urban forest-themed luxury homes nestled in Sector 43.',
        status: 'Active',
        location: 'Noida',
        isMandateProject: false,
        assignedAgents: agentUsers.map((a) => a._id),
      },
      {
        name: 'Brigade Cornerstone Utopia',
        description: '47-acre integrated smart township on Varthur Road with high appreciation potential.',
        status: 'Active',
        location: 'Bangalore',
        isMandateProject: true,
        assignedAgents: [sakirAgent._id, agentUsers[2]._id],
      },
      {
        name: 'Phoenix One Bangalore West',
        description: 'Ultra-luxurious high-rise towers in Rajajinagar featuring sky gardens and concierge.',
        status: 'Active',
        location: 'Bangalore',
        isMandateProject: false,
        assignedAgents: agentUsers.map((a) => a._id),
      },
      {
        name: 'My Home Bhooja',
        description: 'Iconic gated community towers in HITEC City with panoramic skyline views.',
        status: 'Active',
        location: 'Hyderabad',
        isMandateProject: true,
        assignedAgents: [sakirAgent._id],
      },
      {
        name: 'Sobha Dream Acres',
        description: 'Sprawling residential enclave in Panathur featuring precast tech & amenities.',
        status: 'Hold',
        location: 'Bangalore',
        isMandateProject: false,
        assignedAgents: agentUsers.map((a) => a._id),
      },
    ];

    const savedProjects = [];
    for (const p of projectsData) {
      let project = await projectModel.findOne({ name: p.name });
      if (project) {
        project.description = p.description;
        project.status = p.status;
        project.location = p.location;
        project.isMandateProject = p.isMandateProject;
        project.assignedAgents = p.assignedAgents;
        await project.save();
        savedProjects.push(project);
      } else {
        project = await projectModel.create(p);
        savedProjects.push(project);
      }
    }
    console.log(`✔ Configured ${savedProjects.length} projects.`);

    // 3. Clear existing leads to ensure clean, consistent data
    await leadModel.deleteMany({});
    console.log('Cleaned old leads. Generating 60+ realistic leads...');

    // Today's date reference: 2026-09-13
    const todayStr = new Date().toISOString().split('T')[0]; // e.g. 2026-09-13

    // Lead Raw Seed Data Matrix
    const leadTemplates = [
      // Follow-up scheduled for TODAY
      {
        name: 'Vikram Malhotra',
        phone: '9820145672',
        email: 'vikram.malhotra@gmail.com',
        source: 'Meta',
        stage: 'follow-up',
        status: 'hot',
        followUpToday: true,
        projectIdx: 0,
        remarks: 'Confirmed today 4 PM follow-up call regarding 3BHK tower-B unit pricing.',
        dayOffset: 1,
      },
      {
        name: 'Priya Nair',
        phone: '9845012389',
        email: 'priya.nair@outlook.com',
        source: 'Google',
        stage: 'site-visit',
        status: 'hot',
        followUpToday: true,
        projectIdx: 0,
        remarks: 'Site visit scheduled today at 11:30 AM with spouse and architect.',
        dayOffset: 2,
      },
      {
        name: 'Aditya Sharma',
        phone: '9811234567',
        email: 'aditya.sharma@techcorp.com',
        source: 'Meta',
        stage: 'revisit',
        status: 'hot',
        followUpToday: true,
        projectIdx: 1,
        remarks: 'Second visit today to finalize corner penthouse on 18th floor.',
        dayOffset: 3,
      },
      {
        name: 'Dr. Sanjeev Kapoor',
        phone: '9934567890',
        email: 'dr.sanjeev@apollo.org',
        source: 'Other',
        stage: 'follow-up',
        status: 'warm',
        followUpToday: true,
        projectIdx: 3,
        remarks: 'Doctor requested callback today between surgeries around 2 PM.',
        dayOffset: 4,
      },
      {
        name: 'Neha Singhania',
        phone: '9822345612',
        email: 'neha.singhania@finserve.in',
        source: 'Google',
        stage: 'site-visit',
        status: 'hot',
        followUpToday: true,
        projectIdx: 2,
        remarks: 'Requested site visit today afternoon; looking for immediate possession.',
        dayOffset: 5,
      },
      {
        name: 'Rohan Mehta',
        phone: '9711223344',
        email: 'rohan.mehta@startup.io',
        source: 'Meta',
        stage: 'follow-up',
        status: 'warm',
        followUpToday: true,
        projectIdx: 4,
        remarks: 'Needs updated payment schedule brochure sent before today evening call.',
        dayOffset: 6,
      },
      {
        name: 'Karthik Sundaram',
        phone: '9444123456',
        email: 'karthik.sundaram@tcs.com',
        source: 'Other',
        stage: 'revisit',
        status: 'hot',
        followUpToday: true,
        projectIdx: 5,
        remarks: 'Revisit with parents today 5 PM to select Vastu-compliant flat.',
        dayOffset: 7,
      },
      {
        name: 'Ananya Rao',
        phone: '9880123987',
        email: 'ananya.rao@wipro.com',
        source: 'Google',
        stage: 'follow-up',
        status: 'warm',
        followUpToday: true,
        projectIdx: 0,
        remarks: 'Loan eligibility pre-approved with SBI; finalizing unit booking amount today.',
        dayOffset: 8,
      },

      // Bookings Done (Successful conversions)
      {
        name: 'Rajesh Gupta',
        phone: '9810011223',
        email: 'rajesh.gupta@maruti.com',
        source: 'Meta',
        stage: 'booking',
        status: 'hot',
        projectIdx: 0,
        remarks: 'Booking advance of ₹5,00,000 received for 3.5 BHK East Facing unit.',
        dayOffset: 12,
      },
      {
        name: 'Deepak Verma',
        phone: '9829012345',
        email: 'deepak.verma@consultant.com',
        source: 'Google',
        stage: 'booking',
        status: 'hot',
        projectIdx: 1,
        remarks: 'Unit C-1402 booked. Agreement signing scheduled next Monday.',
        dayOffset: 10,
      },
      {
        name: 'Suresh Menon',
        phone: '9447012345',
        email: 'suresh.menon@gulfship.ae',
        source: 'Other',
        stage: 'booking',
        status: 'hot',
        projectIdx: 3,
        remarks: 'NRI buyer. Booking form signed, 10% payment transferred via NRE account.',
        dayOffset: 9,
      },
      {
        name: 'Kavita Reddy',
        phone: '9849012345',
        email: 'kavita.reddy@hyderabadre.com',
        source: 'Google',
        stage: 'booking',
        status: 'hot',
        projectIdx: 5,
        remarks: 'Token payment received for 4 BHK Lake View Villa.',
        dayOffset: 6,
      },
      {
        name: 'Amitabh Sen',
        phone: '9830012345',
        email: 'amitabh.sen@kpmg.com',
        source: 'Meta',
        stage: 'booking',
        status: 'hot',
        projectIdx: 4,
        remarks: 'Tower 2 unit 1104 booked. HDFC home loan sanctioned.',
        dayOffset: 3,
      },
      {
        name: 'Sneha Kulkarni',
        phone: '9823012345',
        email: 'sneha.kulkarni@infosys.com',
        source: 'Google',
        stage: 'booking',
        status: 'hot',
        projectIdx: 0,
        remarks: 'Booking token cleared. KYC documents submitted.',
        dayOffset: 1,
      },

      // Site Visit Done (High Intent)
      {
        name: 'Arjun Singhania',
        phone: '9820098765',
        email: 'arjun.singhania@indianoil.in',
        source: 'Meta',
        stage: 'site-visit-done',
        status: 'hot',
        projectIdx: 0,
        remarks: 'Loved the clubhouse and open green area. Negotiating on floor rise charges.',
        dayOffset: 2,
      },
      {
        name: 'Tanvi Deshmukh',
        phone: '9821098765',
        email: 'tanvi.deshmukh@hdfc.com',
        source: 'Google',
        stage: 'site-visit-done',
        status: 'warm',
        projectIdx: 1,
        remarks: 'Visited DLF site yesterday. Comparing with nearby Godrej project.',
        dayOffset: 3,
      },
      {
        name: 'Gaurav Agarwal',
        phone: '9818098765',
        email: 'gaurav.agarwal@paytm.com',
        source: 'Meta',
        stage: 'site-visit-done',
        status: 'hot',
        projectIdx: 2,
        remarks: 'Liked 3 BHK sample flat. Requested customized payment milestone plan.',
        dayOffset: 4,
      },
      {
        name: 'Meera Iyer',
        phone: '9840098765',
        email: 'meera.iyer@chennaipetro.com',
        source: 'Other',
        stage: 'site-visit-done',
        status: 'warm',
        projectIdx: 3,
        remarks: 'Site visit completed. Waiting for son to confirm from USA.',
        dayOffset: 5,
      },
      {
        name: 'Nikhil Bansal',
        phone: '9811098765',
        email: 'nikhil.bansal@zomato.com',
        source: 'Google',
        stage: 'site-visit-done',
        status: 'hot',
        projectIdx: 4,
        remarks: 'Showed interest in 2700 sqft apartment. Pricing meeting scheduled.',
        dayOffset: 7,
      },
      {
        name: 'Shalini Saxena',
        phone: '9899098765',
        email: 'shalini.saxena@airtel.in',
        source: 'Meta',
        stage: 'site-visit-done',
        status: 'warm',
        projectIdx: 5,
        remarks: 'Inspection done. Inquired about clubhouse delivery timeline.',
        dayOffset: 8,
      },
      {
        name: 'Pradeep Joshi',
        phone: '9822098765',
        email: 'pradeep.joshi@tatamotors.com',
        source: 'Other',
        stage: 'site-visit-done',
        status: 'warm',
        projectIdx: 0,
        remarks: 'Visited with family. Requested car parking slot details.',
        dayOffset: 10,
      },
      {
        name: 'Ritu Chawla',
        phone: '9871098765',
        email: 'ritu.chawla@delhihighcourt.nic.in',
        source: 'Google',
        stage: 'site-visit-done',
        status: 'hot',
        projectIdx: 1,
        remarks: 'Verified legal approvals. Highly keen on top floor unit.',
        dayOffset: 11,
      },

      // Site Visit Scheduled
      {
        name: 'Manish Pandey',
        phone: '9855012345',
        email: 'manish.pandey@bhel.in',
        source: 'Meta',
        stage: 'site-visit',
        status: 'warm',
        projectIdx: 2,
        remarks: 'Site visit scheduled for coming Saturday 10 AM.',
        dayOffset: 4,
      },
      {
        name: 'Bhavna Bhatt',
        phone: '9825012345',
        email: 'bhavna.bhatt@cadila.com',
        source: 'Google',
        stage: 'site-visit',
        status: 'warm',
        projectIdx: 0,
        remarks: 'Confirmed cab pickup for site tour on Sunday.',
        dayOffset: 6,
      },
      {
        name: 'Harish Pillai',
        phone: '9847012345',
        email: 'harish.pillai@cochinshipyard.in',
        source: 'Meta',
        stage: 'site-visit',
        status: 'hot',
        projectIdx: 3,
        remarks: 'Visiting Bangalore next week. Dedicated tour booked.',
        dayOffset: 7,
      },
      {
        name: 'Sunita Kashyap',
        phone: '9810023456',
        email: 'sunita.kashyap@dpsrkp.net',
        source: 'Other',
        stage: 'site-visit',
        status: 'warm',
        projectIdx: 1,
        remarks: 'School principal looking for retirement home. Tour arranged.',
        dayOffset: 9,
      },
      {
        name: 'Varun Grover',
        phone: '9820034567',
        email: 'varun.grover@writerhub.com',
        source: 'Google',
        stage: 'site-visit',
        status: 'hot',
        projectIdx: 4,
        remarks: 'Requested peaceful corner flat viewing.',
        dayOffset: 11,
      },
      {
        name: 'Swati Deshpande',
        phone: '9823045678',
        email: 'swati.deshpande@symbiosis.ac.in',
        source: 'Meta',
        stage: 'site-visit',
        status: 'warm',
        projectIdx: 5,
        remarks: 'Interested in gated community for elderly parents.',
        dayOffset: 12,
      },

      // Active Follow-ups
      {
        name: 'Alok Nath Tripathi',
        phone: '9839012345',
        email: 'alok.tripathi@railnet.gov.in',
        source: 'Meta',
        stage: 'follow-up',
        status: 'warm',
        projectIdx: 0,
        remarks: 'Follow up on floor plan options for tower 4.',
        dayOffset: 3,
      },
      {
        name: 'Divya Nambiar',
        phone: '9846012345',
        email: 'divya.nambiar@ustglobal.com',
        source: 'Google',
        stage: 'follow-up',
        status: 'warm',
        projectIdx: 3,
        remarks: 'Requested WhatsApp sharing of cost breakdown sheet.',
        dayOffset: 5,
      },
      {
        name: 'Sameer Sheikh',
        phone: '9820056789',
        email: 'sameer.sheikh@diamondexports.com',
        source: 'Other',
        stage: 'follow-up',
        status: 'hot',
        projectIdx: 4,
        remarks: 'High net-worth investor looking to buy 2 adjoining units.',
        dayOffset: 7,
      },
      {
        name: 'Pooja Hegde',
        phone: '9845067890',
        email: 'pooja.hegde@biocon.com',
        source: 'Meta',
        stage: 'follow-up',
        status: 'warm',
        projectIdx: 0,
        remarks: 'Discussing budget with spouse. Call next Tuesday.',
        dayOffset: 8,
      },
      {
        name: 'Kishore Kumar',
        phone: '9811078901',
        email: 'kishore.kumar@airindia.in',
        source: 'Google',
        stage: 'follow-up',
        status: 'cold',
        projectIdx: 1,
        remarks: 'Pilot frequently on international flights; prefers email communication.',
        dayOffset: 9,
      },
      {
        name: 'Anil Ambavat',
        phone: '9822089012',
        email: 'anil.ambavat@textiles.in',
        source: 'Meta',
        stage: 'follow-up',
        status: 'warm',
        projectIdx: 2,
        remarks: 'Looking for 3BHK within 1.4 Cr budget.',
        dayOffset: 10,
      },
      {
        name: 'Bina Roy',
        phone: '9831090123',
        email: 'bina.roy@calcuttauniv.ac.in',
        source: 'Other',
        stage: 'follow-up',
        status: 'warm',
        projectIdx: 3,
        remarks: 'Follow up regarding possession timeline and builder reputation.',
        dayOffset: 12,
      },

      // Revisits
      {
        name: 'Mukesh Parekh',
        phone: '9820091234',
        email: 'mukesh.parekh@bseindia.com',
        source: 'Google',
        stage: 'revisit',
        status: 'hot',
        projectIdx: 0,
        remarks: 'Second visit arranged to show unit to Vastu consultant.',
        dayOffset: 4,
      },
      {
        name: 'Geeta Subramanian',
        phone: '9840092345',
        email: 'geeta.subramanian@tcs.com',
        source: 'Meta',
        stage: 'revisit',
        status: 'hot',
        projectIdx: 3,
        remarks: 'Revisit scheduled to compare Tower A vs Tower B views.',
        dayOffset: 8,
      },
      {
        name: 'Kamal Nayan',
        phone: '9810093456',
        email: 'kamal.nayan@marico.com',
        source: 'Other',
        stage: 'revisit',
        status: 'warm',
        projectIdx: 1,
        remarks: 'Finalizing unit options with family.',
        dayOffset: 11,
      },

      // RNR (Ring No Response - typical sales funnel category)
      {
        name: 'Siddharth Jain',
        phone: '9818012349',
        email: 'siddharth.jain@gmail.com',
        source: 'Meta',
        stage: 'RNR',
        status: 'cold',
        projectIdx: 1,
        remarks: 'Called 3 times, phone ringing no response. Sent WhatsApp intro.',
        dayOffset: 1,
      },
      {
        name: 'Abhishek Roy',
        phone: '9830023459',
        email: 'abhishek.roy@yahoo.com',
        source: 'Google',
        stage: 'RNR',
        status: 'cold',
        projectIdx: 0,
        remarks: 'RNR on first and second call. Scheduled automated SMS.',
        dayOffset: 2,
      },
      {
        name: 'Prakash Rao',
        phone: '9849034569',
        email: 'prakash.rao@gmail.com',
        source: 'Meta',
        stage: 'RNR',
        status: 'cold',
        projectIdx: 5,
        remarks: 'Phone not reachable during work hours.',
        dayOffset: 5,
      },
      {
        name: 'Dinesh Bhatia',
        phone: '9810045679',
        email: 'dinesh.bhatia@rediffmail.com',
        source: 'Other',
        stage: 'RNR',
        status: 'cold',
        projectIdx: 2,
        remarks: 'Number busy continually. Will re-attempt tomorrow.',
        dayOffset: 7,
      },
      {
        name: 'Shweta Tiwari',
        phone: '9820056780',
        email: 'shweta.tiwari@gmail.com',
        source: 'Google',
        stage: 'RNR',
        status: 'cold',
        projectIdx: 4,
        remarks: 'No pickup. Follow-up queued for alternate timing.',
        dayOffset: 9,
      },
      {
        name: 'Vinod Nair',
        phone: '9847067891',
        email: 'vinod.nair@live.com',
        source: 'Meta',
        stage: 'RNR',
        status: 'cold',
        projectIdx: 0,
        remarks: 'Ring no response. Lead flagged for evening callback.',
        dayOffset: 11,
      },

      // Leads in "set-stage" (Pending stage classification - Needs attention)
      {
        name: 'Rajendra Prasad',
        phone: '9811099901',
        email: 'rajendra.prasad@gov.in',
        source: 'Meta',
        stage: 'set-stage',
        status: 'warm',
        projectIdx: 0,
        remarks: 'New lead incoming via Meta Facebook Form. Assigned to Sakir Agent.',
        dayOffset: 0,
      },
      {
        name: 'Madhavan Krishnan',
        phone: '9845099902',
        email: 'madhavan.krishnan@techie.com',
        source: 'Google',
        stage: 'set-stage',
        status: 'warm',
        projectIdx: 3,
        remarks: 'Inquired from Google Ads search for luxury 3 BHK in Whitefield.',
        dayOffset: 0,
      },
      {
        name: 'Anuradha Sen',
        phone: '9830099903',
        email: 'anuradha.sen@kolkata.org',
        source: 'Other',
        stage: 'set-stage',
        status: 'cold',
        projectIdx: 4,
        remarks: 'Direct walk-in inquiry at sales lounge. Stage to be set by agent.',
        dayOffset: 1,
      },
      {
        name: 'Farhan Akhtar',
        phone: '9820099904',
        email: 'farhan.akhtar@creative.com',
        source: 'Meta',
        stage: 'set-stage',
        status: 'warm',
        projectIdx: 1,
        remarks: 'Lead imported from Meta campaign. Initial contact pending.',
        dayOffset: 1,
      },
      {
        name: 'Gita Munjal',
        phone: '9810099905',
        email: 'gita.munjal@herocorp.com',
        source: 'Google',
        stage: 'set-stage',
        status: 'hot',
        projectIdx: 2,
        remarks: 'Urgent callback requested via Google Ad extension.',
        dayOffset: 2,
      },

      // Historical Leads: August 2026 (Month 8)
      {
        name: 'Satish Chandra',
        phone: '9820188801',
        email: 'satish.chandra@tata.com',
        source: 'Meta',
        stage: 'booking',
        status: 'hot',
        projectIdx: 0,
        remarks: 'August booking finalized. Construction link payment progressing.',
        month: 8,
        day: 5,
      },
      {
        name: 'Kiran Mazumdar',
        phone: '9845088802',
        email: 'kiran.m@biotech.in',
        source: 'Google',
        stage: 'site-visit-done',
        status: 'warm',
        projectIdx: 3,
        remarks: 'Visited August 12. Considering investment.',
        month: 8,
        day: 12,
      },
      {
        name: 'Harsh Goenka',
        phone: '9820088803',
        email: 'harsh.g@rpg.in',
        source: 'Other',
        stage: 'booking',
        status: 'hot',
        projectIdx: 4,
        remarks: 'August booking completed for duplex penthouse.',
        month: 8,
        day: 18,
      },
      {
        name: 'Ashok Leyland Rep',
        phone: '9840088804',
        email: 'corp.housing@ashok.in',
        source: 'Google',
        stage: 'site-visit',
        status: 'warm',
        projectIdx: 1,
        remarks: 'Corporate bulk booking inquiry.',
        month: 8,
        day: 22,
      },
      {
        name: 'Devika Rani',
        phone: '9811088805',
        email: 'devika.rani@arts.org',
        source: 'Meta',
        stage: 'follow-up',
        status: 'cold',
        projectIdx: 2,
        remarks: 'Requested callback in winter.',
        month: 8,
        day: 26,
      },
      {
        name: 'Naveen Jindal',
        phone: '9818088806',
        email: 'naveen.j@steel.in',
        source: 'Meta',
        stage: 'booking',
        status: 'hot',
        projectIdx: 5,
        remarks: 'Bhooja 4BHK booked in late August.',
        month: 8,
        day: 28,
      },
      {
        name: 'Pallavi Joshi',
        phone: '9822088807',
        email: 'pallavi.j@theatre.in',
        source: 'Google',
        stage: 'RNR',
        status: 'cold',
        projectIdx: 0,
        remarks: 'RNR during August promo.',
        month: 8,
        day: 30,
      },

      // Historical Leads: July 2026 (Month 7)
      {
        name: 'Cyrus Poonawalla',
        phone: '9822077701',
        email: 'cyrus.p@serum.in',
        source: 'Other',
        stage: 'booking',
        status: 'hot',
        projectIdx: 4,
        remarks: 'July booking token received.',
        month: 7,
        day: 10,
      },
      {
        name: 'Nandita Das',
        phone: '9830077702',
        email: 'nandita.das@cinema.org',
        source: 'Meta',
        stage: 'site-visit-done',
        status: 'warm',
        projectIdx: 0,
        remarks: 'July site visit completed.',
        month: 7,
        day: 15,
      },
      {
        name: 'Ajay Piramal',
        phone: '9820077703',
        email: 'ajay.p@pharma.in',
        source: 'Google',
        stage: 'booking',
        status: 'hot',
        projectIdx: 1,
        remarks: 'July executive booking.',
        month: 7,
        day: 24,
      },
    ];

    const leadsToInsert = [];

    leadTemplates.forEach((tmpl, idx) => {
      const project = savedProjects[tmpl.projectIdx % savedProjects.length];

      // Assign agent: alternate between Sakir Agent and others so Sakir Agent has plenty of leads
      let assignedAgents = [];
      if (idx % 2 === 0 || tmpl.followUpToday) {
        assignedAgents = [sakirAgent._id];
      } else {
        const otherAgent = agentUsers[(idx % (agentUsers.length - 1)) + 1];
        assignedAgents = [otherAgent._id];
      }

      // Calculate createdAt date
      let createdDate = new Date(2026, 8, 13); // Default September 13, 2026
      if (tmpl.month && tmpl.day) {
        createdDate = new Date(2026, tmpl.month - 1, tmpl.day, 10 + (idx % 8), (idx * 7) % 60);
      } else if (tmpl.dayOffset !== undefined) {
        const day = Math.max(1, 13 - tmpl.dayOffset);
        createdDate = new Date(2026, 8, day, 9 + (idx % 9), (idx * 11) % 60);
      }

      // Calculate followUpDate
      let followUpDate = null;
      if (tmpl.followUpToday) {
        // Today is September 13, 2026
        followUpDate = new Date(2026, 8, 13, 14, 0, 0);
      } else if (tmpl.stage === 'follow-up' || tmpl.stage === 'site-visit') {
        if (idx % 3 === 0) {
          // Tomorrow: September 14, 2026
          followUpDate = new Date(2026, 8, 14, 11, 0, 0);
        } else if (idx % 3 === 1) {
          // Next week: September 18, 2026
          followUpDate = new Date(2026, 8, 18, 16, 0, 0);
        } else {
          // Past: September 8, 2026
          followUpDate = new Date(2026, 8, 8, 10, 0, 0);
        }
      }

      // Build realistic timeline history
      const timeline = [
        {
          stage: 'set-stage',
          remarks: `Lead originated via ${tmpl.source} marketing campaign for ${project.name}.`,
          date: createdDate,
        },
      ];

      if (tmpl.stage !== 'set-stage') {
        const midDate = new Date(createdDate.getTime() + 1000 * 60 * 60 * 24);
        timeline.push({
          stage: tmpl.stage === 'booking' ? 'site-visit-done' : 'follow-up',
          remarks: 'Contact established. Buyer requirements verified & project presentation sent.',
          date: midDate,
        });

        if (tmpl.stage === 'booking' || tmpl.stage === 'revisit' || tmpl.stage === 'site-visit-done') {
          const finalDate = new Date(midDate.getTime() + 1000 * 60 * 60 * 48);
          timeline.push({
            stage: tmpl.stage,
            remarks: tmpl.remarks,
            date: finalDate,
          });
        }
      }

      leadsToInsert.push({
        project: project._id,
        interested_in: [project._id],
        name: tmpl.name,
        email: tmpl.email,
        phone: tmpl.phone,
        source: tmpl.source,
        assignedAgent: assignedAgents,
        stage: tmpl.stage,
        status: tmpl.status || 'warm',
        followUpDate: followUpDate,
        remarks: tmpl.remarks,
        timeline: timeline,
        createdAt: createdDate,
        updatedAt: new Date(createdDate.getTime() + 1000 * 60 * 60 * 2),
      });
    });

    await leadModel.insertMany(leadsToInsert);
    console.log(`✔ Successfully inserted ${leadsToInsert.length} realistic CRM leads!`);

    // Verification Summary
    const totalLeads = await leadModel.countDocuments();
    const todayLeadsCount = await leadModel.countDocuments({
      followUpDate: {
        $gte: new Date('2026-09-13T00:00:00.000Z'),
        $lte: new Date('2026-09-13T23:59:59.999Z'),
      },
    });
    const bookingCount = await leadModel.countDocuments({ stage: 'booking' });
    const siteVisitCount = await leadModel.countDocuments({ stage: 'site-visit-done' });

    console.log('\n=============================================');
    console.log('       CRM SEEDING COMPLETE SUMMARY          ');
    console.log('=============================================');
    console.log(`Total Projects:         ${savedProjects.length}`);
    console.log(`Total Leads:            ${totalLeads}`);
    console.log(`Today's Follow-up Leads: ${todayLeadsCount}`);
    console.log(`Converted Bookings:     ${bookingCount}`);
    console.log(`Completed Site Visits:  ${siteVisitCount}`);
    console.log('Test Accounts (Password: 123456 for all):');
    console.log('  Admin:   sakir@gmail.com');
    console.log('  Manager: sakirmanager@gmail.com');
    console.log('  Agent:   sakiragent@gmail.com');
    console.log('  Partner: sam@gmail.com');
    console.log('=============================================\n');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
};

seed();
