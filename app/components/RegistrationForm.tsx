"use client";

import { useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api.js';
import { Upload, CreditCard, DollarSign, QrCode, User, Phone, Building2, Briefcase } from 'lucide-react';
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
    padding: 30px 20px;
    margin: 0 10px;
    border-radius: 20px;
  }

  @media (max-width: 480px) {
    padding: 25px 15px;
    margin: 0 5px;
  }
`;

const FormTitle = styled.h2`
  color: #111827;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 35px;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 1.75rem;
    margin-bottom: 30px;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 25px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 18px;

  @media (max-width: 480px) {
    margin-bottom: 16px;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #111827;
  font-size: 0.95rem;

  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 6px;
  }
`;

const InputWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 10px 12px;
  background: #ffffff;

  @media (max-width: 480px) {
    padding: 8px 10px;
    gap: 8px;
  }
`;

const InputIcon = styled.div`
  color: #6b7280;
  display: flex;
  align-items: center;
  flex-shrink: 0;
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

  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

const PaymentSection = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  margin: 25px 0;
  background: #ffffff;

  @media (max-width: 768px) {
    padding: 18px 16px;
    margin: 20px 0;
  }

  @media (max-width: 480px) {
    padding: 16px 14px;
    margin: 18px 0;
  }
`;

const PaymentTitle = styled.h3`
  color: #111827;
  font-size: 1.05rem;
  font-weight: 700;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 12px;
  }
`;

const PaymentOptions = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const PaymentOption = styled.button<{ selected: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border: 2px solid ${props => props.selected ? '#3b82f6' : '#e5e7eb'};
  border-radius: 10px;
  background: ${props => props.selected ? '#eff6ff' : '#ffffff'};
  color: ${props => props.selected ? '#1d4ed8' : '#374151'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.selected ? '#3b82f6' : '#d1d5db'};
    background: ${props => props.selected ? '#eff6ff' : '#f9fafb'};
  }

  @media (max-width: 480px) {
    padding: 10px 14px;
    font-size: 0.9rem;
  }
`;

const QRCodeContainer = styled.div`
  text-align: center;
  margin: 20px 0;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;

  @media (max-width: 480px) {
    padding: 16px;
    margin: 16px 0;
  }
`;

const AmountText = styled.p`
  color: #059669;
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 15px;

  @media (max-width: 480px) {
    font-size: 1rem;
    margin-bottom: 12px;
  }
`;

const QRCodeImage = styled.img`
  width: 200px;
  height: 200px;
  margin: 0 auto 15px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  @media (max-width: 480px) {
    width: 180px;
    height: 180px;
    margin-bottom: 12px;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 24px;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    padding: 14px 20px;
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    padding: 12px 18px;
    font-size: 0.95rem;
    margin-top: 8px;
  }
`;

const ErrorMessage = styled.span`
  color: #dc2626;
  font-size: 0.9rem;
  margin-top: 5px;
  display: block;

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

interface FormData {
  name: string;
  homeClub: string;
  designation: string;
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

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();

  const watchedFields = watch();

  const generateQRForPayment = async () => {
    // Generate QR code with basic payment info - no need to wait for form completion
    const payload = {
      eSewa_id: '9813173643',
      name: watchedFields.name || 'Event Registration',
      amount: 200,
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
        designation: data.designation,
        phoneNumber: data.phoneNumber,
        paymentMethod: paymentMethod,
        paymentScreenshot: screenshotStorageId as any,
      });

      setRegistrationResult({
        ...result,
        name: data.name,
        homeClub: data.homeClub,
        designation: data.designation,
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
            <Label htmlFor="designation">Designation *</Label>
            <InputWrap>
              <InputIcon><Briefcase size={18} /></InputIcon>
              <Input
                id="designation"
                type="text"
                placeholder="Enter your designation/role"
                {...register('designation', { required: 'Designation is required' })}
              />
            </InputWrap>
            {errors.designation && <ErrorMessage>{errors.designation.message}</ErrorMessage>}
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

            {paymentMethod === 'cash' && (
              <div style={{ 
                textAlign: 'center', 
                margin: '20px 0', 
                padding: '20px', 
                background: '#f8fafc', 
                borderRadius: '12px', 
                border: '1px solid #e2e8f0' 
              }}>
                <AmountText>Registration Fee: NPR 200</AmountText>
                <p style={{ color: '#666', fontSize: '0.9rem', textAlign: 'center', margin: '0' }}>
                  Please bring the exact amount to the event venue
                </p>
              </div>
            )}

            {paymentMethod === 'qr' && paymentQR && (
              <QRCodeContainer>
                <AmountText>Registration Fee: NPR 200</AmountText>
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