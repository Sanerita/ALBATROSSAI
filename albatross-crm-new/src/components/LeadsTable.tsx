'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Lead, LeadStatus } from '@/types'
import { ChevronDown, ChevronUp, ArrowUpDown, MoreHorizontal, Mail, User, Clock, CheckCircle } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

interface LeadsTableProps {
  leads: Lead[]
  onStatusChange: (leadId: string, newStatus: LeadStatus) => void
  onRowClick?: (leadId: string) => void
}

type SortKey = keyof Pick<Lead, 'name' | 'company' | 'budget' | 'score' | 'lastContact'>
type SortDirection = 'asc' | 'desc'

const statusIcons = {
  new: <Clock className="h-4 w-4" />,
  contacted: <Mail className="h-4 w-4" />,
  closed: <CheckCircle className="h-4 w-4" />
}

export function LeadsTable({ leads, onStatusChange, onRowClick }: LeadsTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({
    key: 'score',
    direction: 'desc'
  })
  const [filterStatus, setFilterStatus] = useState<LeadStatus | 'all'>('all')

  const handleSort = (key: SortKey) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const sortedLeads = [...leads].sort((a, b) => {
    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]
    
    if (aValue === undefined || bValue === undefined) return 0
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  const filteredLeads = filterStatus === 'all' 
    ? sortedLeads 
    : sortedLeads.filter(lead => lead.status === filterStatus)

  const getStatusVariant = (status: LeadStatus) => {
    switch (status) {
      case 'new': return 'secondary'
      case 'contacted': return 'outline'
      case 'closed': return 'default'
      default: return 'outline'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('all')}
            size="sm"
          >
            All Leads
          </Button>
          {(Object.keys(statusIcons) as LeadStatus[]).map(status => (
            <Button
              key={status}
              variant={filterStatus === status ? 'default' : 'outline'}
              onClick={() => setFilterStatus(status)}
              size="sm"
              className="gap-1 capitalize"
            >
              {statusIcons[status]}
              {status}
            </Button>
          ))}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('name')}
                  className="px-1"
                >
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Name
                    {sortConfig.key === 'name' && (
                      sortConfig.direction === 'asc' 
                        ? <ChevronUp className="h-4 w-4" />
                        : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </Button>
              </TableHead>
              <TableHead>Company</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('budget')}
                  className="px-1"
                >
                  <div className="flex items-center gap-1">
                    Budget
                    {sortConfig.key === 'budget' && (
                      sortConfig.direction === 'asc' 
                        ? <ChevronUp className="h-4 w-4" />
                        : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('score')}
                  className="px-1"
                >
                  <div className="flex items-center gap-1">
                    Score
                    {sortConfig.key === 'score' && (
                      sortConfig.direction === 'asc' 
                        ? <ChevronUp className="h-4 w-4" />
                        : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('lastContact')}
                  className="px-1"
                >
                  <div className="flex items-center gap-1">
                    Last Contact
                    {sortConfig.key === 'lastContact' && (
                      sortConfig.direction === 'asc' 
                        ? <ChevronUp className="h-4 w-4" />
                        : <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </Button>
              </TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.length > 0 ? (
              filteredLeads.map(lead => (
                <TableRow 
                  key={lead.id} 
                  className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
                  onClick={() => onRowClick?.(lead.id)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {lead.name}
                    </div>
                  </TableCell>
                  <TableCell>{lead.company || '-'}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      maximumFractionDigits: 0
                    }).format(lead.budget)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusVariant(lead.status)} className="capitalize">
                        {statusIcons[lead.status]}
                        {lead.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-secondary rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            lead.score > 75 ? 'bg-green-500' :
                            lead.score > 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${lead.score}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">{lead.score}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {lead.lastContact 
                      ? new Date(lead.lastContact).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })
                      : 'Never'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                        {(Object.keys(statusIcons) as LeadStatus[])
                          .filter(status => status !== lead.status)
                          .map(status => (
                            <DropdownMenuItem
                              key={status}
                              onClick={(e) => {
                                e.stopPropagation()
                                onStatusChange(lead.id, status)
                              }}
                              className="gap-2 capitalize"
                            >
                              {statusIcons[status]}
                              Mark as {status}
                            </DropdownMenuItem>
                          ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No leads found matching your criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}