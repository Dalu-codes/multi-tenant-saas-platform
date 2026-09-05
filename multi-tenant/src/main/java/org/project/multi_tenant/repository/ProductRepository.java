package org.project.multi_tenant.repository;

import org.project.multi_tenant.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, String> {

    List<Product> findByTenantId(String tenantId);
}
