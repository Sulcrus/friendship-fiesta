"use client";

import { useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api.js';
import { Upload, CreditCard, DollarSign, QrCode, User, Phone, Building2 } from 'lucide-react';
import QRCode from 'qrcode';
import FileUpload from './FileUpload';
import SuccessModal from './SuccessModal';

const FormContainer = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 25px;
  padding: 50px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 550px;
  position: relative;
  overflow: hidden;

  &::before { display: none; }

  @media (max-width: 768px) {
    padding: 40px 30px;
    margin: 0 10px;
  }
`;

const FormTitle = styled.h2`
  color: #111827;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 35px;
  letter-spacing: -0.02em;
`;

const FormGroup = styled.div`
  margin-bottom: 18px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #111827;
  font-size: 0.95rem;
`;

const InputWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  background: #ffffff;
`;

const InputIcon = styled.div`
  color: #6b7280;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 6px 0;
  border: none;
  background: transparent;
  font-size: 1rem;
  outline: none;
  color: #111827;

  &::placeholder {
    color: #9ca3af;
  }
`;

const PaymentSection = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  margin: 25px 0;
  background: #ffffff;
`;

const PaymentTitle = styled.h3`
  color: #111827;
  font-size: 1.05rem;
  font-weight: 700;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PaymentOptions = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const PaymentOption = styled.button<{ selected: boolean }>`
  flex: 1;
  padding: 12px 14px;
  border: 1px solid ${props => props.selected ? '#111827' : '#e5e7eb'};
  border-radius: 10px;
  background: #ffffff;
  color: ${props => props.selected ? '#111827' : '#374151'};
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: border-color .2s ease, box-shadow .2s ease;

  &:hover {
    border-color: #111827;
    box-shadow: 0 2px 10px rgba(17, 24, 39, 0.06);
  }
`;

const QRCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
  margin-top: 12px;
  border: 1px solid #e5e7eb;
`;

const QRCodeImage = styled.img`
  width: 220px;
  height: 220px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
`;

const AmountText = styled.p`
  color: #667eea;
  font-weight: 600;
  font-size: 1.1rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 14px;
  background: #111827;
  color: white;
  border-radius: 10px;
  font-size: 1.05rem;
  font-weight: 700;
  transition: opacity .2s ease;
  margin-top: 20px;

  &:hover {
    opacity: 0.92;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 5px;
`;

interface FormData {
  name: string;
  homeClub: string;
  phoneNumber: string;
}

export default function RegistrationForm() {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qr'>('cash');
  const [paymentQR, setPaymentQR] = useState<string>('');
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [registrationResult, setRegistrationResult] = useState<any>(null);

  const createRegistration = useMutation(api.registrations.create);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const generatePaymentQR = useMutation(api.registrations.generatePaymentQR);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();

  const watchedFields = watch();

  const generateQRForPayment = async () => {
    if (!watchedFields.name || !watchedFields.homeClub || !watchedFields.phoneNumber) {
      return;
    }

    const payload = {
      eSewa_id: '9813173643',
      name: watchedFields.name,
      amount: 250,
      purpose: 'Friendship Fiesta 3.0 Registration',
    };

    try {
      const qrData = JSON.stringify(payload);
      const qrCodeUrl = await QRCode.toDataURL(qrData, {
        width: 220,
        margin: 1,
        color: {
          dark: '#111827',
          light: '#ffffff',
        },
      });
      setPaymentQR(qrCodeUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      let screenshotStorageId: string | undefined = undefined;
      if (paymentMethod === 'qr' && paymentScreenshot) {
        const uploadUrl = await generateUploadUrl();
        const res = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Content-Type': paymentScreenshot.type },
          body: paymentScreenshot,
        });
        if (!res.ok) throw new Error('Upload failed');
        const { storageId } = await res.json();
        screenshotStorageId = storageId;
      }
      const result = await createRegistration({
        name: data.name,
        homeClub: data.homeClub,
        phoneNumber: data.phoneNumber,
        paymentMethod: paymentMethod, // Use state value instead of form data
        paymentScreenshot: screenshotStorageId as any,
      });

      setRegistrationResult({
        ...result,
        name: data.name,
        homeClub: data.homeClub,
      });
      setShowSuccess(true);
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentMethodChange = (method: 'cash' | 'qr') => {
    setPaymentMethod(method);
    if (method === 'qr') {
      generateQRForPayment();
    }
  };

  return (
    <>
      <FormContainer>
        <FormTitle>Event Registration</FormTitle>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label htmlFor="name">Full Name *</Label>
            <InputWrap>
              <InputIcon><User size={18} /></InputIcon>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                {...register('name', { required: 'Name is required' })}
              />
            </InputWrap>
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="homeClub">Home Club Name *</Label>
            <InputWrap>
              <InputIcon><Building2 size={18} /></InputIcon>
              <Input
                id="homeClub"
                type="text"
                placeholder="Enter your home club name"
                {...register('homeClub', { required: 'Home club is required' })}
              />
            </InputWrap>
            {errors.homeClub && <ErrorMessage>{errors.homeClub.message}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <InputWrap>
              <InputIcon><Phone size={18} /></InputIcon>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Enter your phone number"
                {...register('phoneNumber', { 
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[0-9+\-\s\(\)]+$/,
                    message: 'Please enter a valid phone number'
                  }
                })}
              />
            </InputWrap>
            {errors.phoneNumber && <ErrorMessage>{errors.phoneNumber.message}</ErrorMessage>}
          </FormGroup>

          <PaymentSection>
            <PaymentTitle>
              <CreditCard size={20} />
              Payment Method
            </PaymentTitle>
            
            <PaymentOptions>
              <PaymentOption
                type="button"
                selected={paymentMethod === 'cash'}
                onClick={() => handlePaymentMethodChange('cash')}
              >
                <DollarSign size={18} />
                Cash Payment
              </PaymentOption>
              <PaymentOption
                type="button"
                selected={paymentMethod === 'qr'}
                onClick={() => handlePaymentMethodChange('qr')}
              >
                <CreditCard size={18} />
                QR Payment
              </PaymentOption>
            </PaymentOptions>

            {paymentMethod === 'qr' && paymentQR && (
              <QRCodeContainer>
                <AmountText>Registration Fee: NPR 250</AmountText>
                <QRCodeImage src={paymentQR} alt="Payment QR Code" />
                <p style={{ color: '#666', fontSize: '0.9rem', textAlign: 'center' }}>
                  Scan this QR code to make payment, then upload your payment screenshot below
                </p>
              </QRCodeContainer>
            )}

            {paymentMethod === 'qr' && (
              <FormGroup>
                <Label>Upload Payment Screenshot *</Label>
                <FileUpload
                  onFileSelect={setPaymentScreenshot}
                  accept="image/*"
                  placeholder="Click to upload payment screenshot"
                />
              </FormGroup>
            )}
          </PaymentSection>

          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Complete Registration'}
          </SubmitButton>
        </form>
      </FormContainer>

      {showSuccess && registrationResult && (
        <SuccessModal
          isOpen={showSuccess}
          onClose={() => setShowSuccess(false)}
          registrationData={registrationResult}
        />
      )}
    </>
  );
}
