"use client";

import { useState } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api.js';
import { Users, CheckCircle, XCircle, Clock, Search, Filter, Lock, Menu, X, Eye, Download, FileSpreadsheet } from 'lucide-react';

const AdminContainer = styled.div`
  min-height: 100vh;
  padding: 16px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  
  @media (min-width: 768px) {
    padding: 20px;
  }
`;

const Header = styled.header`
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  @media (min-width: 768px) {
    padding: 30px;
    margin-bottom: 30px;
  }
`;

const Title = styled.h1`
  color: #1a1a2e;
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (min-width: 768px) {
    font-size: 2.2rem;
    margin-bottom: 10px;
  }
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 0.95rem;
  
  @media (min-width: 768px) {
    font-size: 1.1rem;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 30px;
  }
`;

const StatCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  text-align: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }
  
  @media (min-width: 768px) {
    padding: 25px;
  }
`;

const StatIcon = styled.div<{ color: string }>`
  color: ${props => props.color};
  margin-bottom: 12px;
  display: flex;
  justify-content: center;
  
  @media (min-width: 768px) {
    margin-bottom: 15px;
  }
`;

const StatNumber = styled.h3`
  color: #1a1a2e;
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 4px;
  
  @media (min-width: 768px) {
    font-size: 2rem;
    margin-bottom: 5px;
  }
`;

const StatLabel = styled.p`
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 600;
  
  @media (min-width: 768px) {
    font-size: 0.9rem;
  }
`;

const FiltersContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  @media (min-width: 768px) {
    padding: 20px;
  }
`;

const FilterRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  @media (min-width: 768px) {
    flex-direction: row;
    gap: 15px;
    align-items: center;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: #f8fafc;

  &:focus {
    border-color: #667eea;
    outline: none;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    background: white;
  }
  
  @media (min-width: 768px) {
    min-width: 250px;
  }
`;

const StatusFilter = styled.select`
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.95rem;
  background: #f8fafc;
  transition: all 0.3s ease;

  &:focus {
    border-color: #667eea;
    outline: none;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    background: white;
  }
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const MobileCardContainer = styled.div`
  display: block;
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const DesktopTableContainer = styled.div`
  display: none;
  overflow-x: auto;
  
  @media (min-width: 768px) {
    display: block;
  }
`;

const Table = styled.table`
  width: 100%;
  min-width: 800px;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #f1f5f9;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  }
`;

const TableHeaderCell = styled.th`
  padding: 16px 20px;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
`;

const TableCell = styled.td`
  padding: 16px 20px;
  color: #1e293b;
  font-size: 0.9rem;
  vertical-align: middle;
`;

const MobileCard = styled.div`
  background: #f8fafc;
  margin-bottom: 16px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
`;

const MobileCardHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MobileCardBody = styled.div`
  padding: 16px;
`;

const MobileCardRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e2e8f0;
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const MobileCardLabel = styled.span`
  font-weight: 600;
  color: #475569;
  font-size: 0.85rem;
`;

const MobileCardValue = styled.span`
  color: #1e293b;
  font-size: 0.9rem;
  text-align: right;
`;

const ScreenshotThumb = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    border-color: #667eea;
  }
  
  @media (min-width: 768px) {
    width: 60px;
    height: 60px;
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => {
    switch (props.status) {
      case 'verified':
        return 'background: linear-gradient(135deg, #10b981, #059669); color: white;';
      case 'pending':
        return 'background: linear-gradient(135deg, #f59e0b, #d97706); color: white;';
      case 'rejected':
        return 'background: linear-gradient(135deg, #ef4444, #dc2626); color: white;';
      default:
        return 'background: linear-gradient(135deg, #6b7280, #4b5563); color: white;';
    }
  }}
`;

const ActionButton = styled.button<{ variant: 'approve' | 'reject' }>`
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  margin: 4px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => props.variant === 'approve' 
    ? 'background: linear-gradient(135deg, #10b981, #059669); color: white;'
    : 'background: linear-gradient(135deg, #ef4444, #dc2626); color: white;'
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  @media (max-width: 767px) {
    width: 100%;
    margin: 2px 0;
  }
`;

const PassIdCell = styled.div`
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-weight: 700;
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.85rem;
  display: inline-block;
`;

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #ff6b6b 100%);
  padding: 20px;
`;

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
  max-width: 400px;
  width: 100%;
  
  @media (max-width: 480px) {
    padding: 30px 20px;
  }
`;

const LoginIcon = styled.div`
  color: #667eea;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
`;

const LoginTitle = styled.h2`
  color: #1a1a2e;
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const PasswordInput = styled.input`
  width: 100%;
  padding: 16px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 16px;
  font-size: 1rem;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);

  &:focus {
    border-color: #667eea;
    outline: none;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    background: white;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.p`
  color: #ef4444;
  font-size: 0.9rem;
  margin-top: 12px;
  font-weight: 500;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
  background: white;
  border-radius: 16px;
  margin-top: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const MobileActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
`;

const ExportButton = styled.button`
  padding: 12px 20px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const registrations = useQuery(api.registrations.listWithUrls);
  const updateStatus = useMutation(api.registrations.updateStatus);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = 'Interact@Kathmandu@1995';
    
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password. Please try again.');
      setPassword('');
    }
  };

  // Excel export function
  const exportToExcel = () => {
    const approvedRegistrations = registrations?.filter(reg => reg.status === 'verified') || [];
    
    if (approvedRegistrations.length === 0) {
      alert('No approved registrations to export');
      return;
    }

    // Create CSV content
    const headers = ['Pass ID', 'Name', 'Designation', 'Home Club', 'Phone Number', 'Payment Method', 'Registration Date'];
    const csvContent = [
      headers.join(','),
      ...approvedRegistrations.map(reg => [
        reg.passId,
        `"${reg.name}"`,
        `"${reg.designation}"`,
        `"${reg.homeClub}"`,
        reg.phoneNumber,
        reg.paymentMethod,
        new Date(reg.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `approved_registrations_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isAuthenticated) {
    return (
      <LoginContainer>
        <LoginCard>
          <LoginIcon>
            <Lock size={48} />
          </LoginIcon>
          <LoginTitle>Admin Access</LoginTitle>
          <form onSubmit={handleLogin}>
            <PasswordInput
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <LoginButton type="submit">
              Access Dashboard
            </LoginButton>
          </form>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </LoginCard>
      </LoginContainer>
    );
  }

  const filteredRegistrations = registrations?.filter(reg => {
    const matchesSearch = reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.homeClub.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.passId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || reg.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const stats = registrations ? {
    total: registrations.length,
    pending: registrations.filter(r => r.status === 'pending').length,
    verified: registrations.filter(r => r.status === 'verified').length,
    rejected: registrations.filter(r => r.status === 'rejected').length,
  } : { total: 0, pending: 0, verified: 0, rejected: 0 };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateStatus({ id: id as any, status: newStatus });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminContainer>
      <Header>
        <Title>Admin Dashboard</Title>
        <Subtitle>Manage event registrations for Kathmandu Friendship Fiesta</Subtitle>
      </Header>

      <StatsContainer>
        <StatCard>
          <StatIcon color="#667eea">
            <Users size={28} />
          </StatIcon>
          <StatNumber>{stats.total}</StatNumber>
          <StatLabel>Total Registrations</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon color="#f59e0b">
            <Clock size={28} />
          </StatIcon>
          <StatNumber>{stats.pending}</StatNumber>
          <StatLabel>Pending Review</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon color="#10b981">
            <CheckCircle size={28} />
          </StatIcon>
          <StatNumber>{stats.verified}</StatNumber>
          <StatLabel>Verified</StatLabel>
        </StatCard>

        <StatCard>
          <StatIcon color="#ef4444">
            <XCircle size={28} />
          </StatIcon>
          <StatNumber>{stats.rejected}</StatNumber>
          <StatLabel>Rejected</StatLabel>
        </StatCard>
      </StatsContainer>

      <FiltersContainer>
        <FilterRow>
          <SearchInput
            type="text"
            placeholder="Search by name, designation, club, or pass ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <StatusFilter
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </StatusFilter>
          <ExportButton
            onClick={exportToExcel}
            disabled={stats.verified === 0}
          >
            <FileSpreadsheet size={18} />
            Export Approved
          </ExportButton>
        </FilterRow>
      </FiltersContainer>

      <TableContainer>
        {/* Mobile Card View */}
        <MobileCardContainer>
          {filteredRegistrations.map((registration) => (
            <MobileCard key={registration._id}>
              <MobileCardHeader>
                <PassIdCell>{registration.passId}</PassIdCell>
                <StatusBadge status={registration.status}>
                  {registration.status}
                </StatusBadge>
              </MobileCardHeader>
              
              <MobileCardBody>
                <MobileCardRow>
                  <MobileCardLabel>Name</MobileCardLabel>
                  <MobileCardValue>{registration.name}</MobileCardValue>
                </MobileCardRow>
                
                <MobileCardRow>
                  <MobileCardLabel>Designation</MobileCardLabel>
                  <MobileCardValue>{registration.designation}</MobileCardValue>
                </MobileCardRow>
                
                <MobileCardRow>
                  <MobileCardLabel>Home Club</MobileCardLabel>
                  <MobileCardValue>{registration.homeClub}</MobileCardValue>
                </MobileCardRow>
                
                <MobileCardRow>
                  <MobileCardLabel>Phone</MobileCardLabel>
                  <MobileCardValue>{registration.phoneNumber}</MobileCardValue>
                </MobileCardRow>
                
                <MobileCardRow>
                  <MobileCardLabel>Payment</MobileCardLabel>
                  <MobileCardValue style={{ textTransform: 'capitalize' }}>
                    {registration.paymentMethod}
                  </MobileCardValue>
                </MobileCardRow>
                
                <MobileCardRow>
                  <MobileCardLabel>Screenshot</MobileCardLabel>
                  <MobileCardValue>
                    {registration.screenshotUrl ? (
                      <a href={registration.screenshotUrl} target="_blank" rel="noreferrer">
                        <ScreenshotThumb src={registration.screenshotUrl} alt="screenshot" />
                      </a>
                    ) : (
                      <span style={{ color: '#9ca3af' }}>N/A</span>
                    )}
                  </MobileCardValue>
                </MobileCardRow>
                
                <MobileCardRow>
                  <MobileCardLabel>Date</MobileCardLabel>
                  <MobileCardValue>{formatDate(registration.createdAt)}</MobileCardValue>
                </MobileCardRow>
                
                {registration.status === 'pending' && (
                  <MobileActionsContainer>
                    <ActionButton
                      variant="approve"
                      onClick={() => handleStatusUpdate(registration._id, 'verified')}
                    >
                      Approve
                    </ActionButton>
                    <ActionButton
                      variant="reject"
                      onClick={() => handleStatusUpdate(registration._id, 'rejected')}
                    >
                      Reject
                    </ActionButton>
                  </MobileActionsContainer>
                )}
              </MobileCardBody>
            </MobileCard>
          ))}
        </MobileCardContainer>

        {/* Desktop Table View */}
        <DesktopTableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Pass ID</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Designation</TableHeaderCell>
                <TableHeaderCell>Home Club</TableHeaderCell>
                <TableHeaderCell>Phone</TableHeaderCell>
                <TableHeaderCell>Payment</TableHeaderCell>
                <TableHeaderCell>Screenshot</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {filteredRegistrations.map((registration) => (
                <TableRow key={registration._id}>
                  <TableCell>
                    <PassIdCell>{registration.passId}</PassIdCell>
                  </TableCell>
                  <TableCell>{registration.name}</TableCell>
                  <TableCell>{registration.designation}</TableCell>
                  <TableCell>{registration.homeClub}</TableCell>
                  <TableCell>{registration.phoneNumber}</TableCell>
                  <TableCell>
                    <span style={{ textTransform: 'capitalize' }}>
                      {registration.paymentMethod}
                    </span>
                  </TableCell>
                  <TableCell>
                    {registration.screenshotUrl ? (
                      <a href={registration.screenshotUrl} target="_blank" rel="noreferrer">
                        <ScreenshotThumb src={registration.screenshotUrl} alt="screenshot" />
                      </a>
                    ) : (
                      <span style={{ color: '#9ca3af' }}>N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={registration.status}>
                      {registration.status}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>{formatDate(registration.createdAt)}</TableCell>
                  <TableCell>
                    {registration.status === 'pending' && (
                      <>
                        <ActionButton
                          variant="approve"
                          onClick={() => handleStatusUpdate(registration._id, 'verified')}
                        >
                          Approve
                        </ActionButton>
                        <ActionButton
                          variant="reject"
                          onClick={() => handleStatusUpdate(registration._id, 'rejected')}
                        >
                          Reject
                        </ActionButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </DesktopTableContainer>
      </TableContainer>

      {filteredRegistrations.length === 0 && (
        <EmptyState>
          <EmptyStateIcon>📋</EmptyStateIcon>
          <h3 style={{ marginBottom: '12px', color: '#475569' }}>
            {registrations?.length === 0 
              ? 'No registrations yet' 
              : 'No matching registrations'
            }
          </h3>
          <p>
            {registrations?.length === 0 
              ? 'Registration data will appear here once users start signing up.' 
              : 'Try adjusting your search criteria or filters.'
            }
          </p>
        </EmptyState>
      )}
    </AdminContainer>
  );
}