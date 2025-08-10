"use client";

import { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';

const PassContainer = styled.div`
  width: 380px;
  height: 580px;
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-radius: 24px;
  padding: 20px;
  color: #111827;
  position: relative;
  margin: 20px auto;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

const WatermarkContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
`;

const Watermark = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
  font-size: 2.8rem;
  font-weight: 900;
  color: rgba(102, 126, 234, 0.03);
  letter-spacing: 0.15em;
  white-space: nowrap;
  user-select: none;
`;

const PassContent = styled.div`
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const PassHeader = styled.div`
  text-align: center;
  margin-bottom: 8px;
`;

const Logo = styled.div`
  width: 140px;
  height: 42px;
  margin: 0 auto 12px;
  background-image: url('/logo.png');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
`;

const EventTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 800;
  margin: 12px 0 6px 0;
  color: #111827;
  line-height: 1.3;
  letter-spacing: -0.02em;
`;


const EventSubtitle = styled.p`
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 600;
  margin: 0;
  letter-spacing: 0.02em;
`;

const PassBody = styled.div`
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  padding: 16px 0;
`;

const PassIdSection = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 12px 16px;
  margin: 0 auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const PassIdLabel = styled.p`
  font-size: 0.75rem;
  color: #64748b;
  margin: 0 0 4px 0;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
`;

const PassId = styled.div`
  font-size: 0.9rem;
  font-family: 'SF Mono', 'Monaco', 'Cascadia Code', monospace;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: 0.1em;
`;

const QRSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const QRContainer = styled.div`
  width: 120px;
  height: 120px;
  background: white;
  border-radius: 16px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #e2e8f0;
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.05),
    0 2px 4px rgba(0, 0, 0, 0.02);
`;

const QRImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 8px;
`;

const ScanHint = styled.p`
  font-size: 0.7rem;
  color: #64748b;
  margin: 0;
  font-weight: 500;
  letter-spacing: 0.02em;
`;

const UserSection = styled.div`
  background: rgba(102, 126, 234, 0.04);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid rgba(102, 126, 234, 0.1);
`;

const UserName = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 6px 0;
  color: #1e293b;
  word-break: break-word;
  line-height: 1.3;
  letter-spacing: -0.01em;
`;

const UserDesignation = styled.p`
  font-size: 0.95rem;
  margin: 0 0 6px 0;
  font-weight: 500;
  color: #475569;
  word-break: break-word;
  line-height: 1.3;
`;

const UserClub = styled.p`
  font-size: 0.95rem;
  margin: 0;
  font-weight: 500;
  color: #475569;
  word-break: break-word;
  line-height: 1.3;
`;

const PassFooter = styled.div`
  text-align: center;
  padding-top: 12px;
  border-top: 1px solid rgba(102, 126, 234, 0.1);
`;

const StatusRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  gap: 12px;
`;

const StatusBadge = styled.div`
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid #fed7aa;
  flex-shrink: 0;
`;

const DateBadge = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  flex-shrink: 0;
`;

const ValidityText = styled.p`
  font-size: 0.7rem;
  color: #ef4444;
  margin: 0 0 4px 0;
  line-height: 1.2;
  font-weight: 600;
  letter-spacing: 0.01em;
`;

const EventDate = styled.p`
  font-size: 0.75rem;
  font-weight: 500;
  color: #64748b;
  margin: 0;
  letter-spacing: 0.02em;
`;

const DecorativeLine = styled.div`
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, #667eea 50%, transparent 100%);
  margin: 8px auto 0;
  width: 60px;
  border-radius: 1px;
`;

interface EventPassProps {
  name: string;
  homeClub: string;
  designation: string;
  passId: string;
}

export default function EventPass({ name, homeClub, designation, passId }: EventPassProps) {
  const passRef = useRef<HTMLDivElement>(null);
  const [qrCode, setQrCode] = useState<string>('');

  useEffect(() => {
    const generateQR = async () => {
      try {
        const qrData = JSON.stringify({
          passId,
          name,
          event: 'Kathmandu Friendship Fiesta',
          timestamp: Date.now()
        });

        const qrCodeUrl = await QRCode.toDataURL(qrData, {
          width: 100,
          margin: 2,
          color: {
            dark: '#1e293b',
            light: '#ffffff',
          },
          errorCorrectionLevel: 'M',
        });
        setQrCode(qrCodeUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQR();
  }, [passId, name]);

  const downloadPass = async () => {
    if (passRef.current) {
      try {
        await document.fonts.ready;
        
        const canvas = await html2canvas(passRef.current, {
          backgroundColor: '#ffffff',
          scale: 3,
          useCORS: true,
          allowTaint: true,
          width: 380,
          height: 580,
          logging: false,
          onclone: (clonedDoc) => {
            const clonedElement = clonedDoc.getElementById('event-pass-capture');
            if (clonedElement) {
              clonedElement.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif';
            }
          }
        });
        
        const link = document.createElement('a');
        link.download = `friendship-fiesta-pass-${passId}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
      } catch (error) {
        console.error('Error downloading pass:', error);
      }
    }
  };

  return (
    <PassContainer ref={passRef} id="event-pass-capture">
      <WatermarkContainer>
        <Watermark>FRIENDSHIP FIESTA</Watermark>
      </WatermarkContainer>
      
      <PassContent>
        <PassHeader>
          <Logo />
          <EventTitle>Friendship Fiesta 3.0</EventTitle>
          <EventSubtitle>Official Event Pass</EventSubtitle>
        </PassHeader>

        <PassBody>
          <PassIdSection>
            <PassIdLabel>Pass ID</PassIdLabel>
            <PassId>{passId}</PassId>
          </PassIdSection>

          {qrCode && (
            <QRSection>
              <QRContainer>
                <QRImage src={qrCode} alt="Pass QR Code" />
              </QRContainer>
              <ScanHint>Scan for entry verification</ScanHint>
            </QRSection>
          )}

          <UserSection>
            <UserName>{name}</UserName>
            <UserDesignation>{designation}</UserDesignation>
            <UserClub>{homeClub}</UserClub>
          </UserSection>
        </PassBody>

        <PassFooter>
          <EventDate>Present this pass at event entrance</EventDate>
          <DecorativeLine />
        </PassFooter>
      </PassContent>
    </PassContainer>
  );
}