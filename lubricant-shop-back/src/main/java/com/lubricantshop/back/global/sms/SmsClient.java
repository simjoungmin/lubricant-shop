package com.lubricantshop.back.global.sms;

public interface SmsClient {

    void sendPasswordVerificationCode(String phoneNumber, String code);

    void sendSignupVerificationCode(String phoneNumber, String code);
}
