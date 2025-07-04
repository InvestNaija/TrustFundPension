import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { BranchService } from '../services/branch.service';
import { CreateBranchDto } from '../dto/create-branch.dto';
import { UpdateBranchDto } from '../dto/update-branch.dto';
import { ListBranchesDto } from '../dto/list-branches.dto';
import { AdminAuthGuard } from 'src/core/auth/guards/admin-auth.guard';
import { JwtAuthGuard } from 'src/core/auth/guards/jwt-auth.guard';

@Controller('branches')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchService.create(createBranchDto);
  }

  @Get()
  findAll(@Query() query: ListBranchesDto) {
    return this.branchService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.branchService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  update(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchService.update(id, updateBranchDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  remove(@Param('id') id: string) {
    return this.branchService.remove(id);
  }
} 