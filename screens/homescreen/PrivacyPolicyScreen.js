import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const PrivacyPolicyScreen = ({ navigation }) => {
  return (
    <>
      <View style={styles.container}>
        <Header heading="Privacy Policy" />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.sectionTitle}>Introduction</Text>
          <Text style={styles.content}>
            Welcome to TrackMudra! We are committed to protecting your privacy
            and ensuring the security of your personal information. This Privacy
            Policy outlines our practices regarding the collection, use, and
            disclosure of your information when you use our automated financial
            planning app, TrackMudra, which offers features including Expense
            Tracking, Investment Planning, Retirement Planning, Goal Setting,
            and Financial Literacy.
          </Text>
          <Text style={styles.sectionTitle}>Information We Collect</Text>
          <Text style={styles.subTitle}>Personal Information</Text>
          <Text style={styles.content}>
            When you register and use TrackMudra, we may collect the following
            personal information: - Name - Email address - Phone number -
            Profile picture
          </Text>
          <Text style={styles.subTitle}>Financial Information</Text>
          <Text style={styles.content}>
            To provide our financial planning services, we may collect: -
            Expense details (transactions, categories, amounts) - Investment
            details (portfolio, transactions, returns) - Retirement planning
            data (current savings, retirement goals) - Goals (financial
            objectives, timelines, progress) - Income details (salary, other
            income sources)
          </Text>
          <Text style={styles.subTitle}>Usage Information</Text>
          <Text style={styles.content}>
            We may collect information about how you use our app, including: -
            App usage data (features used, time spent on the app) - Device
            information (device type, operating system, unique device
            identifiers)
          </Text>
          <Text style={styles.sectionTitle}>How We Use Your Information</Text>
          <Text style={styles.content}>
            We use the information we collect for the following purposes:
          </Text>
          <Text style={styles.bulletPoint}>
            - To provide and improve our services:
          </Text>
          <Text style={styles.content}>
            To offer you personalized financial planning services, track your
            expenses, plan your investments, and help you set and achieve
            financial goals.
          </Text>
          <Text style={styles.bulletPoint}>- To communicate with you:</Text>
          <Text style={styles.content}>
            To send you updates, notifications, and other information related to
            your use of TrackMudra.
          </Text>
          <Text style={styles.bulletPoint}>
            - To ensure security and prevent fraud:
          </Text>
          <Text style={styles.content}>
            To protect your information and maintain the integrity of our
            services.
          </Text>
          <Text style={styles.bulletPoint}>
            - To comply with legal obligations:
          </Text>
          <Text style={styles.content}>
            To meet regulatory and legal requirements.
          </Text>
          <Text style={styles.sectionTitle}>Sharing Your Information</Text>
          <Text style={styles.content}>
            We do not sell or rent your personal information to third parties.
            We may share your information with:
          </Text>
          <Text style={styles.bulletPoint}>- Service providers:</Text>
          <Text style={styles.content}>
            Third-party vendors who assist us in providing our services, such as
            payment processors, data analytics providers, and customer support
            services.
          </Text>
          <Text style={styles.bulletPoint}>- Legal authorities:</Text>
          <Text style={styles.content}>
            When required by law or to protect our rights, we may disclose your
            information to law enforcement or other government agencies.
          </Text>
          <Text style={styles.sectionTitle}>Data Security</Text>
          <Text style={styles.content}>
            We implement appropriate security measures to protect your personal
            information from unauthorized access, disclosure, alteration, or
            destruction. However, no method of transmission over the internet or
            electronic storage is completely secure, and we cannot guarantee
            absolute security.
          </Text>
          <Text style={styles.sectionTitle}>Your Rights</Text>
          <Text style={styles.content}>You have the right to:</Text>
          <Text style={styles.bulletPoint}>
            - Access and update your information:
          </Text>
          <Text style={styles.content}>
            You can view and update your personal information within the app.
          </Text>
          <Text style={styles.bulletPoint}>- Delete your information:</Text>
          <Text style={styles.content}>
            You can request the deletion of your personal information by
            contacting us.
          </Text>
          <Text style={styles.bulletPoint}>- Opt-out of communications:</Text>
          <Text style={styles.content}>
            You can opt-out of receiving promotional communications from us by
            following the unsubscribe instructions in those communications.
          </Text>
          <Text style={styles.sectionTitle}>
            Changes to This Privacy Policy
          </Text>
          <Text style={styles.content}>
            We may update this Privacy Policy from time to time. We will notify
            you of any significant changes by posting the new Privacy Policy on
            our app and updating the effective date. Your continued use of
            TrackMudra after any changes indicates your acceptance of the
            updated Privacy Policy.
          </Text>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.content}>
            If you have any questions or concerns about this Privacy Policy or
            our data practices, please contact us at:
          </Text>
          <Text style={styles.contactInfo}>Email: support@trackmudra.com</Text>
          <Text style={styles.content}>
            <Text style={styles.contactInfo}>Address: </Text>
            <Text style={styles.address}>
              COLLEGE CAMPUS. Khentawas, Farrukh Nagar, PIN - 122506, Gurugram,
              Haryana. 0124 – 2375502, 2375503, 2375504. 0124-22753288.
            </Text>
          </Text>
          <Text style={styles.content}>
            Thank you for using TrackMudra. We are committed to helping you
            achieve your financial goals while protecting your privacy.
          </Text>
        </ScrollView>
      </View>
      <Footer navigation={navigation} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  content: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  bulletPoint: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
    marginLeft: 10,
  },
  contactInfo: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
    fontWeight: "bold",
  },
  address: {
    fontWeight: "semibold",
  },
});

export default PrivacyPolicyScreen;
