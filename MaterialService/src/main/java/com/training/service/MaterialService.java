package com.training.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.training.business.bean.MaterialCategoryBean;

@Service
public interface MaterialService {
	MaterialCategoryBean getMaterialCategoryById(String categoryId);
	List<MaterialCategoryBean> getMaterialCategories();
}
