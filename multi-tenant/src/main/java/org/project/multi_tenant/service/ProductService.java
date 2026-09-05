package org.project.multi_tenant.service;

import org.project.multi_tenant.entity.Product;
import org.project.multi_tenant.repository.ProductRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getProductsByTenant(String tenantId) {
        return productRepository.findByTenantId(tenantId);
    }

    public Product saveProduct(String tenantId, Product product) {
        product.setTenantId(tenantId);
        return productRepository.save(product);
    }
}

